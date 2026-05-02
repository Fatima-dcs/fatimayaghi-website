import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import RootLayout from "./RootLayout";

export default function DashboardLayout({
  children,
  title: _title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <RootLayout>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex-1 p-4">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </RootLayout>
  );
}
