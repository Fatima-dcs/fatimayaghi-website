import { useTranslation } from "@/lib/i18n";

const eyebrow: React.CSSProperties = {
  fontFamily: "'Figtree', sans-serif",
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--sand-accent)",
};

export function HowItWorks() {
  const { t, lang } = useTranslation();

  const steps = [
    ...t.howItWorks.steps,
    {
      num: "04",
      title: lang === "ar" ? "تتبعي تقدمك" : "Track your progress",
      desc: lang === "ar"
        ? "الوصول إلى ملخصات الجلسات وتقييمات EQi وخطوات العمل — كل شيء في مكان واحد."
        : "Access session notes, EQi assessments, and action items — all in one place.",
    },
  ];

  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-24">
      <div style={eyebrow}>{t.howItWorks.title}</div>
      <h2
        className="mt-3 max-w-2xl text-4xl font-medium leading-tight font-heading md:text-5xl"
        style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
      >
        {lang === "ar"
          ? "مسار واضح، وليس كرسيًا مفتوحًا."
          : "A clear path, not an open-ended commitment."}
      </h2>

      <div
        className="mt-14 grid gap-px overflow-hidden rounded-3xl md:grid-cols-2"
        style={{ background: "var(--sand-muted)" }}
      >
        {steps.map((step) => (
          <div key={step.num} className="p-10" style={{ background: "var(--sand-bg)" }}>
            <div
              className="text-xl font-heading"
              style={{ color: "var(--sand-accent)", letterSpacing: "-0.02em" }}
            >
              {step.num}
            </div>
            <h3
              className="mt-4 text-2xl font-medium font-heading"
              style={{ color: "var(--sand-ink)", letterSpacing: "-0.01em" }}
            >
              {step.title}
            </h3>
            <p className="mt-3 leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
