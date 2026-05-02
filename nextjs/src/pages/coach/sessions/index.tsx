import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-stone-100 text-stone-500 border-stone-200",
};

export default function CoachSessions() {
  const { data: sessions, isLoading } = api.sessions.list.useQuery();

  return (
    <DashboardLayout title="Sessions">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-800">All Sessions</h1>
          <Link href="/coach/sessions/new">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full">
              + New Session
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        )}

        {!isLoading && sessions?.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-lg font-medium">No sessions yet</p>
            <Link href="/coach/sessions/new">
              <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full">
                Create First Session
              </Button>
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {sessions?.map((session) => (
            <Link key={session.id} href={`/coach/sessions/${session.id}`}>
              <div className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-4 shadow-sm hover:border-teal-200 hover:shadow-md transition-all cursor-pointer">
                <div>
                  <p className="font-medium text-stone-800">{session.title}</p>
                  <p className="text-sm text-stone-400">
                    {new Date(session.session_date).toLocaleDateString("en-GB", {
                      weekday: "short", year: "numeric", month: "short", day: "numeric",
                    })}
                    {" · "}{session.duration_minutes} min
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!session.summary && session.status === "completed" && (
                    <span className="text-xs text-amber-600 font-medium">⚠ No summary</span>
                  )}
                  <Badge className={statusColors[session.status] ?? ""}>{session.status}</Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
