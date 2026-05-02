import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/utils/api";

export default function DashboardIndex() {
  const router = useRouter();
  const { data: profile, isLoading } = api.profile.getMe.useQuery();

  useEffect(() => {
    if (isLoading) return;
    if (profile?.role === "coach") {
      router.replace("/coach");
    } else {
      router.replace("/dashboard/sessions");
    }
  }, [profile, isLoading, router]);

  return null;
}
