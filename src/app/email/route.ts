import type { NextRequest } from "next/server";

/** The QA dashboard moved to /emails-hub; keep old links working. */
export function GET(req: NextRequest) {
  return Response.redirect(new URL("/emails-hub" + req.nextUrl.search, req.nextUrl.origin), 308);
}
