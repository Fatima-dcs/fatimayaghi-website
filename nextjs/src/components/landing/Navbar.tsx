import Link from "next/link";
import { useLangStore } from "@/stores/use-lang-store";
import { useTranslation } from "@/lib/i18n";

export function Navbar() {
  const { t, lang } = useTranslation();
  const setLang = useLangStore((s) => s.setLang);

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-sm"
      style={{ background: "rgba(250,248,245,0.9)", borderBottom: "1px solid #e8e0d6" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span
          className="text-lg font-semibold font-heading"
          style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
        >
          Fatima Yaghi
        </span>

        <nav className="hidden gap-8 text-sm md:flex" style={{ color: "var(--sand-ink-soft)" }}>
          <a href="#about" className="hover:opacity-70 transition-opacity">{t.nav.about}</a>
          <a href="#services" className="hover:opacity-70 transition-opacity">{t.nav.services}</a>
          <a href="#process" className="hover:opacity-70 transition-opacity">{lang === "ar" ? "كيف يعمل؟" : "How it works"}</a>
          <a href="#faq" className="hover:opacity-70 transition-opacity">{lang === "ar" ? "أسئلة شائعة" : "FAQ"}</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--sand-ink-soft)" }}
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
          <Link
            href="/sign-in"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--sand-ink-soft)" }}
          >
            {t.nav.signIn}
          </Link>
          <a
            href="#booking"
            className="rounded-full px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5"
            style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
          >
            {t.nav.book}
          </a>
        </div>
      </div>
    </header>
  );
}
