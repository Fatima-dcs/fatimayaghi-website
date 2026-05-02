import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-300 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-start">
            <p className="text-white font-bold text-lg">Fatima Yaghi</p>
            <p className="text-stone-400 text-sm mt-1">{t.footer.tagline}</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">{t.footer.links.privacy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t.footer.links.terms}</Link>
            <Link href="/support" className="hover:text-white transition-colors">{t.footer.links.support}</Link>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-8 pt-6 text-center text-sm text-stone-500">
          © {year} Fatima Yaghi. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
