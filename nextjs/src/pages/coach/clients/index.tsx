import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { InviteClientDialog } from "@/components/coach/InviteClientDialog";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  prospect:   { label: "Prospect",   color: "#c9b99a" },
  invited:    { label: "Invited",    color: "#8b7355" },
  registered: { label: "Registered", color: "#2b8a3e" },
  inactive:   { label: "Inactive",   color: "#adb5bd" },
};

export default function CoachClients() {
  const { data: clients, isLoading, refetch } = api.clients.list.useQuery();

  return (
    <DashboardLayout title="Clients">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold font-heading" style={{ color: "var(--sand-ink)" }}>
            Clients
          </h1>
          <InviteClientDialog onInvited={() => refetch()} />
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        )}

        {!isLoading && (!clients || clients.length === 0) && (
          <div className="text-center py-20" style={{ color: "var(--sand-muted)" }}>
            <p className="text-5xl mb-4">👥</p>
            <p className="text-lg font-medium" style={{ color: "var(--sand-ink-soft)" }}>No clients yet</p>
            <p className="text-sm mt-1">Invite your first client using the button above.</p>
          </div>
        )}

        <div className="space-y-3">
          {clients?.map((client: any) => {
            const status = STATUS_LABELS[client.client_status ?? "registered"] ?? STATUS_LABELS["registered"]!;
            const initials = (client.full_name ?? "?").charAt(0).toUpperCase();

            return (
              <Link
                key={client.id}
                href={`/coach/clients/${client.id}`}
                className="flex items-center justify-between rounded-2xl border p-4 transition hover:shadow-md"
                style={{ background: "var(--sand-bg)", borderColor: "var(--sand-surface)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ background: "var(--sand-surface)", color: "var(--sand-accent)" }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--sand-ink)" }}>
                      {client.full_name ?? <span style={{ color: "var(--sand-muted)" }}>No name</span>}
                    </p>
                    <p className="text-xs" style={{ color: "var(--sand-ink-soft)" }}>
                      {client.sessionCount} session{client.sessionCount !== 1 ? "s" : ""}
                      {client.lastSession && ` · Last: ${new Date(client.lastSession).toLocaleDateString("en-GB")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ background: `${status.color}22`, color: status.color }}
                  >
                    {status.label}
                  </span>
                  <span style={{ color: "var(--sand-muted)" }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
