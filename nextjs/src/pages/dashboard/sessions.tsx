import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-stone-100 text-stone-500 border-stone-200",
  };
  return <Badge className={colors[status] ?? ""}>{status}</Badge>;
}

export default function SessionsPage() {
  const { t, lang } = useTranslation();
  const { data: sessions, isLoading, refetch } = api.sessions.list.useQuery();
  const toggleStep = api.nextSteps.toggleComplete.useMutation({ onSuccess: () => refetch() });

  return (
    <DashboardLayout title="My Sessions">
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-2xl font-bold text-stone-800">
          {lang === "ar" ? "جلساتي" : "My Sessions"}
        </h1>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
          </div>
        )}

        {!isLoading && sessions?.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-lg font-medium">
              {lang === "ar" ? "لا توجد جلسات بعد" : "No sessions yet"}
            </p>
            <p className="text-sm mt-1">
              {lang === "ar"
                ? "ستظهر جلساتك هنا بعد حجزها"
                : "Your sessions will appear here once scheduled"}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {sessions?.map((session) => (
            <Card key={session.id} className="border border-stone-100 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-stone-800">
                    {session.title}
                  </CardTitle>
                  <StatusBadge status={session.status} />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-stone-500 mt-1">
                  <span>
                    📅 {new Date(session.session_date).toLocaleDateString(
                      lang === "ar" ? "ar-LB" : "en-GB",
                      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                  <span>⏱ {session.duration_minutes} {lang === "ar" ? "دقيقة" : "min"}</span>
                  {session.google_meet_url && (
                    <a
                      href={session.google_meet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      🎥 {lang === "ar" ? "انضمي إلى الاجتماع" : "Join Meeting"}
                    </a>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {session.summary && (
                  <div className="bg-teal-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">
                      {lang === "ar" ? "ملخص الجلسة" : "Session Summary"}
                    </p>
                    <p className="text-stone-700 text-sm leading-relaxed">{session.summary}</p>
                  </div>
                )}

                {(session as any).next_steps?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
                      {lang === "ar" ? "الخطوات التالية" : "Next Steps"}
                    </p>
                    <div className="space-y-2">
                      {(session as any).next_steps.map((step: any) => (
                        <label
                          key={step.id}
                          className="flex items-start gap-3 cursor-pointer group"
                        >
                          <Checkbox
                            checked={step.is_completed}
                            onCheckedChange={(checked) =>
                              toggleStep.mutate({ id: step.id, is_completed: !!checked })
                            }
                            className="mt-0.5"
                          />
                          <span className={`text-sm ${step.is_completed ? "line-through text-stone-400" : "text-stone-700"}`}>
                            {step.description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
