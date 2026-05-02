import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoachClients() {
  const { data: sessions, isLoading } = api.sessions.list.useQuery();

  // Derive unique clients from sessions
  const clientMap = new Map<string, { id: string; name: string; sessionCount: number; lastSession: string }>();
  sessions?.forEach((s) => {
    const existing = clientMap.get(s.client_id);
    if (!existing) {
      clientMap.set(s.client_id, {
        id: s.client_id,
        name: (s as any).client_name ?? s.client_id.slice(0, 8),
        sessionCount: 1,
        lastSession: s.session_date,
      });
    } else {
      existing.sessionCount++;
      if (s.session_date > existing.lastSession) existing.lastSession = s.session_date;
    }
  });
  const clients = Array.from(clientMap.values());

  return (
    <DashboardLayout title="Clients">
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-2xl font-bold text-stone-800">Clients</h1>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        )}

        {!isLoading && clients.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-lg font-medium">No clients yet</p>
            <p className="text-sm mt-1">Clients will appear here once you create sessions for them</p>
          </div>
        )}

        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-stone-800">{client.name}</p>
                  <p className="text-xs text-stone-400">{client.sessionCount} session{client.sessionCount !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">
                Last: {new Date(client.lastSession).toLocaleDateString("en-GB")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
