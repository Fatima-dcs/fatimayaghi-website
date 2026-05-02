import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoachOverview() {
  const { data: sessions } = api.sessions.list.useQuery();
  const { data: profile } = api.profile.getMe.useQuery();

  const upcoming = sessions?.filter((s) => s.status === "scheduled") ?? [];
  const pendingSummaries = sessions?.filter(
    (s) => s.status === "completed" && !s.summary
  ) ?? [];

  return (
    <DashboardLayout title="Coach Dashboard">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-800">
            Welcome, {profile?.full_name ?? "Coach"} 👋
          </h1>
          <Link href="/coach/sessions/new">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full">
              + New Session
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-stone-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-teal-600">{upcoming.length}</p>
            </CardContent>
          </Card>
          <Card className="border-stone-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">Pending Summaries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-500">{pendingSummaries.length}</p>
            </CardContent>
          </Card>
          <Card className="border-stone-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-stone-700">{sessions?.length ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Link href="/coach/sessions">
            <Button variant="outline">View All Sessions</Button>
          </Link>
          <Link href="/coach/clients">
            <Button variant="outline">View Clients</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
