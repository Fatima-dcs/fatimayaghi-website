import { AppProps } from "next/app";
import { useEffect } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import { useLangStore } from "@/stores/use-lang-store";
import "../styles/globals.css";
import { api } from "../utils/api";

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
      </div>
    </RootLayout>
  );
}

export default api.withTRPC(App);
