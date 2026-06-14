import { useTranslation } from "@/lib/i18n";

export function CTA() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div
        className="rounded-[2.5rem] px-10 py-20 text-center"
        style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
      >
        <div
          style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.75,
            color: "var(--sand-surface)",
          }}
        >
          {t.cta.eyebrow}
        </div>
        <h2
          className="mx-auto mt-3 max-w-2xl text-4xl font-medium leading-tight font-heading md:text-5xl"
          style={{ color: "var(--sand-bg)", letterSpacing: "-0.02em" }}
        >
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md" style={{ opacity: 0.85 }}>
          {t.cta.subtitle}
        </p>
        <a
          href="#booking"
          className="mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-medium transition hover:-translate-y-0.5"
          style={{ background: "var(--sand-bg)", color: "var(--sand-accent)" }}
        >
          {t.cta.button}
        </a>
      </div>
    </section>
  );
}
