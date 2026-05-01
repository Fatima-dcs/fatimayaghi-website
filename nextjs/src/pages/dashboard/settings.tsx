import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUser } from "@/hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";

export default function Settings() {
  const { user, loading } = useUser();

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-4 py-5">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
