import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const STATUS_OPTIONS = ["prospect", "invited", "registered", "inactive"] as const;

export default function ClientDetail() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: client, isLoading, refetch } = api.clients.get.useQuery(
    { id },
    { enabled: !!id }
  );

  const updateStatus = api.clients.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Client">
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout title="Client">
        <p style={{ color: "var(--sand-ink-soft)" }}>Client not found.</p>
      </DashboardLayout>
    );
  }

  const pendingInvite = client.client_invitations?.find(
    (inv: any) => !inv.accepted_at && new Date(inv.expires_at) > new Date()
  );

  return (
    <DashboardLayout title={client.full_name ?? "Client"}>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/coach/clients" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--sand-ink-soft)" }}>
            ← Clients
          </Link>
        </div>

        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ background: "var(--sand-bg)", borderColor: "var(--sand-surface)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold font-heading" style={{ color: "var(--sand-ink)" }}>
                {client.full_name ?? <span style={{ color: "var(--sand-muted)" }}>No name set</span>}
              </h1>
              {client.phone && (
                <p className="text-sm mt-1" style={{ color: "var(--sand-ink-soft)" }}>{client.phone}</p>
              )}
            </div>

            {/* Status selector */}
            <select
              value={client.client_status ?? "registered"}
              onChange={(e) => updateStatus.mutate({ client_id: client.id, status: e.target.value as any })}
              className="rounded-full border px-3 py-1.5 text-xs font-medium outline-none"
              style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink)", background: "var(--sand-surface)" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Pending invite */}
          {pendingInvite && (
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "var(--sand-surface)", color: "var(--sand-ink-soft)" }}
            >
              <p className="font-medium" style={{ color: "var(--sand-ink)" }}>Pending invitation</p>
              <p className="mt-1 text-xs">
                Expires {new Date(pendingInvite.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
              </p>
            </div>
          )}
        </div>

        {/* Placeholder tabs for future slices */}
        <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--sand-surface)" }}>
          {["Overview", "Timeline", "Assessments"].map((tab) => (
            <button
              key={tab}
              className="flex-1 rounded-lg py-2 text-sm font-medium transition"
              style={{
                background: tab === "Overview" ? "var(--sand-bg)" : "transparent",
                color: tab === "Overview" ? "var(--sand-ink)" : "var(--sand-ink-soft)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          className="rounded-2xl border p-8 text-center"
          style={{ borderColor: "var(--sand-surface)", color: "var(--sand-muted)" }}
        >
          <p className="text-sm">Session notes and timeline coming in the next slice.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
