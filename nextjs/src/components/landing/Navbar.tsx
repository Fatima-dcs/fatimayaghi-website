import Link from "next/link";
import { useLangStore } from "@/stores/use-lang-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { t, lang } = useTranslation();
  const setLang = useLangStore((s) => s.setLang);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-stone-800">Fatima Yaghi</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors font-medium"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
          <Link href="/sign-in">
            <Button variant="outline" size="sm">{t.nav.signIn}</Button>
          </Link>
          <a href="#booking">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">{t.nav.book}</Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
