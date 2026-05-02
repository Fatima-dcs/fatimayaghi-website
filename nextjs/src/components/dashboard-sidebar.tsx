import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { appConfig } from "@/config/app";
import { useUser } from "@/hooks/useUser";
import { useLangStore } from "@/stores/use-lang-store";
import { ChevronUp } from "lucide-react";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const items = appConfig.dashboard.navigation;

export default function DashboardSidebar() {
  const { user, signOut } = useUser();
  const router = useRouter();
  const { lang, setLang } = useLangStore();

  const truncate = (email: string) =>
    email.length > 20 ? email.substring(0, 20) + "..." : email;

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <p
              onClick={() => router.push("/")}
              className="text-foreground-muted cursor-pointer px-2 pt-2 text-2xl font-bold"
            >
              {appConfig.brand.name}
            </p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={router.pathname === item.url}>
                    <a href={item.url} className="px-4 py-3">
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {lang === "en" ? "🌐 العربية" : "🌐 English"}
            </button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="px-4 py-3">
                  {user?.email ? truncate(user.email) : "Account"}
                  <ChevronUp className="ml-auto h-6 w-6" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={signOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
