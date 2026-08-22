import { listLeads } from "@/lib/leads/store";

// Must always read the DB fresh — a statically-cached leads table would
// silently freeze at whatever existed at build time.
export const dynamic = "force-dynamic";

function formatServices(json: string | null): string {
  if (!json) return "—";
  try {
    const arr = JSON.parse(json) as string[];
    return arr.join(", ");
  } catch {
    return json;
  }
}

export default function AdminLeadsPage() {
  const leads = listLeads();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-navy">Leads</h1>
          <p className="mt-1 text-sm text-muted">
            {leads.length} submission{leads.length === 1 ? "" : "s"} recorded.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page; Link's prefetch would fetch the CSV on hover */}
        <a
          href="/admin/leads/export"
          className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-hover"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-surface-alt text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Services</th>
              <th className="px-4 py-3">Locale</th>
              <th className="px-4 py-3">Qualification</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-muted">{lead.created_at}</td>
                <td className="px-4 py-3 font-medium text-ink">{lead.name}</td>
                <td className="px-4 py-3 text-ink">
                  <div>{lead.email}</div>
                  {lead.phone ? <div className="text-muted">{lead.phone}</div> : null}
                </td>
                <td className="px-4 py-3 text-ink">{formatServices(lead.services)}</td>
                <td className="px-4 py-3 uppercase text-muted">{lead.locale ?? "—"}</td>
                <td className="px-4 py-3 text-ink">
                  {lead.qualified_at ? (
                    <div className="space-y-0.5 text-xs text-muted">
                      {lead.country_of_residence ? <div>Country: {lead.country_of_residence}</div> : null}
                      {lead.timeline ? <div>Timeline: {lead.timeline}</div> : null}
                      {lead.party_size ? <div>Party size: {lead.party_size}</div> : null}
                    </div>
                  ) : (
                    <span className="text-muted">Step 1 only</span>
                  )}
                </td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No leads yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
