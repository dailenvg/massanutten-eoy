import { renderEmailDashboard } from "@/lib/email-dashboard";

const HTML = { "Content-Type": "text/html; charset=utf-8" } as const;

/** QA dashboard for the confirmation email, every season. */
export function GET() {
  return new Response(renderEmailDashboard(), { headers: HTML });
}
