import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      const type = new URLSearchParams(window.location.search).get("type");
      const next = new URLSearchParams(window.location.search).get("next") ?? "/dashboard";

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      if (type === "recovery") {
        router.replace("/reset-password");
      } else {
        router.replace(next);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-stone-500 text-sm">Signing you in...</p>
    </div>
  );
}
