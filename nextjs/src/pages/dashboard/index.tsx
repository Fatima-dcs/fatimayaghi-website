import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/twitter");
  }, [router]);

  return null;
}
