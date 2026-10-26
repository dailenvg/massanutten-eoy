import type { NextRequest } from "next/server";
import { renderConfirmationEmail } from "@/lib/confirmation-email";
import { seasonFromParam } from "@/lib/season";

const HTML = { "Content-Type": "text/html; charset=utf-8" } as const;

/** Email-safe confirmation HTML for one season key, e.g. /email/confirmation/hs. */
export async function GET(req: NextRequest, ctx: RouteContext<"/email/confirmation/[season]">) {
  const { season: key } = await ctx.params;
  const season = seasonFromParam(key);
  if (!season) return new Response("Unknown season", { status: 404 });
  return new Response(renderConfirmationEmail(season, req.nextUrl.origin), { headers: HTML });
}
