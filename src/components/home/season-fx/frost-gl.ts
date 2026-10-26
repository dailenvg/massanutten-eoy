import { FROST_FRAG, FROST_VERT, THAW_POINTS } from "./frost-shader";

export type FrostFrame = {
  width: number;
  height: number;
  grow: number;
  time: number;
  refreeze: number;
  /** Edge band width multiplier (1 = full reach). */
  reach: number;
  /** Flat [x, y, age] triples, THAW_POINTS long. */
  thaw: Float32Array;
};

export type FrostRenderer = {
  draw: (frame: FrostFrame) => void;
  dispose: () => void;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

/** Full-screen-quad frost renderer. Returns null when WebGL is unusable. */
export function createFrostRenderer(canvas: HTMLCanvasElement): FrostRenderer | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "low-power" });
  if (!gl || !gl.getExtension("OES_standard_derivatives")) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, FROST_VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FROST_FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(program, "uRes"),
    grow: gl.getUniformLocation(program, "uGrow"),
    time: gl.getUniformLocation(program, "uTime"),
    thaw: gl.getUniformLocation(program, "uThaw"),
    refreeze: gl.getUniformLocation(program, "uRefreeze"),
    reach: gl.getUniformLocation(program, "uReach"),
  };
  gl.clearColor(0, 0, 0, 0);

  return {
    draw(frame) {
      if (canvas.width !== frame.width || canvas.height !== frame.height) {
        canvas.width = frame.width;
        canvas.height = frame.height;
      }
      gl.viewport(0, 0, frame.width, frame.height);
      gl.uniform2f(u.res, frame.width, frame.height);
      gl.uniform1f(u.grow, frame.grow);
      gl.uniform1f(u.time, frame.time);
      gl.uniform1f(u.refreeze, frame.refreeze);
      gl.uniform1f(u.reach, frame.reach);
      gl.uniform3fv(u.thaw, frame.thaw.subarray(0, THAW_POINTS * 3));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
