import { useTranslation } from "@/lib/i18n";

const eyebrow: React.CSSProperties = {
  fontFamily: "'Figtree', sans-serif",
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--sand-accent)",
};

export function Services() {
  const { t, lang } = useTranslation();

  const items = [
    {
      num: "01",
      title: t.services.coaching.title,
      body: t.services.coaching.desc,
      tag: t.services.coaching.tag,
      available: true,
    },
    {
      num: "02",
      title: lang === "ar" ? "تقييم الذكاء العاطفي EQi 2.0" : "EQi 2.0 Assessment",
      body: lang === "ar"
        ? "تقييم علمي للذكاء العاطفي يمنح كوتشينغنا نقطة انطلاق ملموسة. يكشف نقاط قوتك ومجالات نموك."
        : "A scientifically validated emotional intelligence assessment that gives our coaching a concrete starting point — understanding your strengths and growth areas.",
      tag: lang === "ar" ? "متخصص" : "Specialist",
      available: true,
    },
    {
      num: "03",
      title: t.services.ai.title,
      body: t.services.ai.desc,
      tag: t.services.ai.tag,
      available: false,
    },
  ];

  return (
    <section id="services" style={{ background: "var(--sand-surface)" }}>
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-end gap-8 md:grid-cols-2">
          <div>
            <div style={eyebrow}>{lang === "ar" ? "الخدمات" : "Services"}</div>
            <h2
              className="mt-3 text-4xl font-medium leading-tight font-heading md:text-5xl"
              style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
            >
              {t.services.title}
            </h2>
          </div>
          <p style={{ color: "var(--sand-ink-soft)" }}>
            {lang === "ar"
              ? "كل تعاون يبدأ بمكالمة اكتشاف مجانية مدتها 30 دقيقة. نمضي قدمًا فقط إذا كان التوافق صحيحًا من الطرفين."
              : "Every engagement starts with a free 30-minute discovery call. We only move forward if it feels right on both sides."}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.num}
              className={`rounded-3xl p-8 transition hover:-translate-y-1 ${!item.available ? "opacity-60" : ""}`}
              style={{
                background: "var(--sand-bg)",
                boxShadow: "0 8px 32px -16px rgba(43,38,34,0.12)",
              }}
            >
              <div
                className="text-2xl font-heading"
                style={{ color: "var(--sand-muted)", letterSpacing: "-0.02em" }}
              >
                {item.num}
              </div>
              <div
                className="mt-2 text-xs font-medium"
                style={{ color: "var(--sand-accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                {item.tag}
              </div>
              <h3
                className="mt-4 text-2xl font-medium font-heading"
                style={{ color: "var(--sand-ink)", letterSpacing: "-0.01em" }}
              >
                {item.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--sand-ink-soft)" }}
              >
                {item.body}
              </p>
              {item.available && (
                <a
                  href="#booking"
                  className="mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5"
                  style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
                >
                  {t.nav.book}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
