import { useTranslation } from "@/lib/i18n";

const eyebrow: React.CSSProperties = {
  fontFamily: "'Figtree', sans-serif",
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--sand-accent)",
};

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section style={{ background: "var(--sand-surface)" }}>
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div style={eyebrow} className="text-center mb-3">
          {t.testimonials.eyebrow}
        </div>
        <h2
          className="text-center text-4xl font-medium font-heading mb-12 md:text-5xl"
          style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
        >
          {t.testimonials.title}
        </h2>

        <div className="grid gap-10 md:grid-cols-2">
          {t.testimonials.items.map((item) => (
            <figure
              key={item.author}
              className="rounded-3xl p-10"
              style={{ background: "var(--sand-bg)" }}
            >
              <div
                className="text-6xl leading-none font-heading"
                style={{ color: "var(--sand-muted)" }}
              >
                "
              </div>
              <blockquote
                className="mt-2 text-xl font-medium leading-snug font-heading"
                style={{ color: "var(--sand-ink)", letterSpacing: "-0.01em" }}
              >
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 text-sm" style={{ color: "var(--sand-ink-soft)" }}>
                — {item.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
