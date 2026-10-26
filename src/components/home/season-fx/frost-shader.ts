/** Maximum thaw points kept in the CPU ring buffer (shader array size). */
export const THAW_POINTS = 32;

export const FROST_VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/*
 * Procedural frost, written for this project:
 * - edge mask: distance to the nearest edge, boosted in corners, warped by noise
 * - crystals: cellular distance field gives plate facets, ridged fbm along a
 *   rotated domain gives feathery fern strands
 * - lighting: normal from the height field's screen-space derivative, a fixed
 *   key light for specular glints
 * - thaw: each point stores (x, y, age); its radius shrinks as it refreezes
 */
export const FROST_FRAG = `
#extension GL_OES_standard_derivatives : enable
precision mediump float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uGrow;
uniform float uTime;
uniform vec3 uThaw[${THAW_POINTS}];
uniform float uRefreeze;
/* Band width multiplier: 1 on the wide stage, narrower on the phone column. */
uniform float uReach;

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    s += a * vnoise(p);
    p = r * p * 2.03;
    a *= 0.5;
  }
  return s;
}

float ridged(vec2 p) {
  float s = 0.0;
  float a = 0.55;
  mat2 r = mat2(0.6, -0.8, 0.8, 0.6);
  for (int i = 0; i < 4; i++) {
    s += a * (1.0 - abs(vnoise(p) * 2.0 - 1.0));
    p = r * p * 2.17;
    a *= 0.5;
  }
  return s;
}

float cells(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = vec2(hash(i + g), hash(i + g + 7.31));
      float d = length(g + o - f);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
    }
  }
  return d2 - d1;
}

float height(vec2 p) {
  float facets = smoothstep(0.0, 0.12, cells(p * 9.0));
  vec2 w = vec2(fbm(p * 4.0), fbm(p * 4.0 + 5.2)) * 0.9;
  vec2 q1 = vec2(p.x + p.y * 0.58, p.y - p.x * 0.58);
  vec2 q2 = vec2(p.x - p.y * 0.58, p.y + p.x * 0.58);
  float fern = max(pow(ridged(q1 * 16.0 + w * 3.0), 4.0), pow(ridged(q2 * 13.0 - w * 3.0), 4.0));
  return clamp(fern * 0.9 + (1.0 - facets) * 0.3, 0.0, 1.0);
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2(vUv.x * aspect, vUv.y);

  /* Side bands ~5.5% of width, top/bottom ~4% of height, larger corner lobes. */
  vec2 e = min(vUv, 1.0 - vUv);
  float warp = (fbm(p * 3.0) - 0.5) * 0.6;
  float grow = uReach * uGrow;
  vec2 band = vec2(0.055, 0.04) * grow + 0.0001;
  vec2 bandDist = e / band * (1.0 + warp);
  float edgeMask = 1.0 - smoothstep(0.25, 1.0, min(bandDist.x, bandDist.y));
  float lobe = length(e / (vec2(0.1, 0.16) * grow + 0.0001)) * (1.0 + warp * 0.8);
  float cornerMask = 1.0 - smoothstep(0.3, 1.0, lobe);
  float mask = max(edgeMask, cornerMask);

  float thaw = 0.0;
  for (int i = 0; i < ${THAW_POINTS}; i++) {
    vec3 t = uThaw[i];
    float life = clamp(1.0 - t.z / uRefreeze, 0.0, 1.0);
    if (life <= 0.0) continue;
    vec2 d = vec2((vUv.x - t.x) * aspect, vUv.y - t.y);
    float r = 0.075 * (0.4 + 0.6 * life);
    thaw = max(thaw, (1.0 - smoothstep(r * 0.4, r, length(d))) * life * life);
  }
  mask *= 1.0 - thaw * 0.92;

  float h = height(p);
  vec2 n = vec2(dFdx(h), dFdy(h)) * 18.0;
  vec3 nrm = normalize(vec3(-n, 1.0));
  vec3 light = normalize(vec3(-0.45, 0.6, 0.65));
  float diff = clamp(dot(nrm, light), 0.0, 1.0);
  float spec = pow(clamp(dot(reflect(-light, nrm), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 28.0);
  float glint = step(0.996, hash(floor(p * 260.0))) * (0.5 + 0.5 * sin(uTime * 2.3 + hash(floor(p * 260.0)) * 40.0));

  float haze = mask * (0.2 + 0.14 * fbm(p * 6.0));
  float crystal = mask * smoothstep(0.35, 0.9, h) * 0.7;
  vec3 tint = mix(vec3(0.78, 0.89, 0.98), vec3(1.0), diff);
  vec3 col = tint * (haze + crystal * 0.7) + vec3(spec * 0.5 + glint * 0.5) * crystal;
  float alpha = clamp(haze + crystal * 0.6 + (spec + glint * 0.5) * crystal * 0.25, 0.0, 0.58);
  gl_FragColor = vec4(min(col, vec3(alpha)), alpha);
}
`;
