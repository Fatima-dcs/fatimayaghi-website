import { AppProps } from "next/app";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import RootLayout from "@/components/layout/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import { useLangStore } from "@/stores/use-lang-store";
import "../styles/globals.css";
import { api } from "../utils/api";

const CookieBanner = dynamic(
  () => import("@/components/CookieBanner").then((m) => m.CookieBanner),
  { ssr: false }
);

function App({ Component, pageProps }: AppProps) {
  const lang = useLangStore((s) => s.lang);

  useEffect(() => {
    useLangStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <RootLayout>
      <div className="min-h-screen">
        <Component {...pageProps} />
        <Toaster />
        <CookieBanner />
      </div>
    </RootLayout>
  );
}

export default api.withTRPC(App);
