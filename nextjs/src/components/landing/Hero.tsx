import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

const eyebrow: React.CSSProperties = {
  fontFamily: "'Figtree', sans-serif",
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--sand-accent)",
};

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 md:grid-cols-2 md:pt-24">
      <div>
        <div style={eyebrow}>{t.hero.badge}</div>
        <h1
          className="mt-4 text-5xl font-medium leading-[1.05] font-heading md:text-6xl"
          style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
        >
          {t.hero.headline}
        </h1>
        <p
          className="mt-6 max-w-md text-lg leading-relaxed"
          style={{ color: "var(--sand-ink-soft)" }}
        >
          {t.hero.subheadline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#booking"
            className="rounded-full px-6 py-3.5 text-sm font-medium transition hover:-translate-y-0.5"
            style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
          >
            {t.hero.cta}
          </a>
          <a
            href="#process"
            className="rounded-full border px-6 py-3.5 text-sm font-medium transition hover:bg-white/40"
            style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink)" }}
          >
            {t.nav.about === "About" ? "How I work" : "كيف أعمل"}
          </a>
        </div>
        <div
          className="mt-10 flex items-center gap-6 text-xs"
          style={{ color: "var(--sand-ink-soft)" }}
        >
          <span>ICF ACC Candidate · EQi 2.0 Certified</span>
          <span style={{ color: "var(--sand-muted)" }}>•</span>
          <span>{t.nav.home === "Home" ? "Lebanese Women" : "للمرأة اللبنانية"}</span>
        </div>
      </div>

      <div className="relative">
        <div
          className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgba(139,115,85,0.45)]"
          style={{ background: `linear-gradient(160deg, var(--sand-muted) 0%, var(--sand-accent) 100%)` }}
        >
          <Image
            src="/fatima.png"
            alt="Fatima Yaghi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-end p-8">
            <div
              className="rounded-2xl px-5 py-4 backdrop-blur-sm"
              style={{ background: "rgba(250,248,245,0.9)", color: "var(--sand-ink)" }}
            >
              <div style={eyebrow}>{t.nav.home === "Home" ? "This week" : "هذا الأسبوع"}</div>
              <div className="mt-1 text-sm font-medium">
                {t.nav.home === "Home" ? "Discovery slots open" : "أماكن متاحة للاستكشاف"}
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-full md:block"
          style={{ background: "var(--sand-surface)" }}
        />
      </div>
    </section>
  );
}
