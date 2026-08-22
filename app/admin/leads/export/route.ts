import { NextResponse } from "next/server";
import { listLeads, leadsToCsv } from "@/lib/leads/store";

// Protected by proxy.ts's /admin session check, same as every other admin route.
export function GET() {
  const csv = leadsToCsv(listLeads());

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="srh-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
