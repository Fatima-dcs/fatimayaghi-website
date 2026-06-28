import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const { t, lang } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept(type: "all" | "essential") {
    localStorage.setItem(STORAGE_KEY, type);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
    >
      <div
        className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl p-6 shadow-[0_8px_40px_-8px_rgba(43,38,34,0.25)] sm:flex-row sm:items-center sm:justify-between"
        style={{ background: "var(--sand-bg)", border: "1px solid var(--sand-muted)" }}
      >
        <div>
          <p className="font-medium text-sm" style={{ color: "var(--sand-ink)" }}>
            {t.cookieBanner.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
            {t.cookieBanner.description}{" "}
            <Link href="/privacy" className="underline hover:opacity-70">
              {t.footer.links.privacy}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => accept("essential")}
            className="rounded-full border px-4 py-2 text-xs font-medium transition hover:opacity-70"
            style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink-soft)" }}
          >
            {t.cookieBanner.essentialOnly}
          </button>
          <button
            onClick={() => accept("all")}
            className="rounded-full px-4 py-2 text-xs font-medium transition hover:-translate-y-0.5"
            style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
          >
            {t.cookieBanner.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
