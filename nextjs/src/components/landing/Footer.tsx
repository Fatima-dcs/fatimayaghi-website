import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: "1px solid var(--sand-muted)" }}>
      <div
        className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-sm md:flex-row md:items-center"
        style={{ color: "var(--sand-ink-soft)" }}
      >
        <div>
          <p className="font-semibold font-heading" style={{ color: "var(--sand-ink)" }}>
            Fatima Yaghi
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--sand-muted)" }}>
            {t.footer.tagline}
          </p>
        </div>

        <div className="flex gap-6">
          <Link href="/privacy" className="hover:opacity-70 transition-opacity">
            {t.footer.links.privacy}
          </Link>
          <Link href="/terms" className="hover:opacity-70 transition-opacity">
            {t.footer.links.terms}
          </Link>
          <Link href="/support" className="hover:opacity-70 transition-opacity">
            {t.footer.links.support}
          </Link>
        </div>

        <div className="text-xs" style={{ color: "var(--sand-muted)" }}>
          © {year} Fatima Yaghi. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
