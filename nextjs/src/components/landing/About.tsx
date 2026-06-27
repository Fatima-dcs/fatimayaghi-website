import { useTranslation } from "@/lib/i18n";
import { api } from "@/utils/api";
import { eyebrowStyle } from "./styles";

export function About() {
  const { t, lang } = useTranslation();
  const { data: content } = api.content.list.useQuery();

  const coachDesc = lang === "ar"
    ? (content?.about_coach?.value_ar || t.about.coachDesc)
    : (content?.about_coach?.value_en || t.about.coachDesc);

  const itDesc = lang === "ar"
    ? (content?.about_it?.value_ar || t.about.itDesc)
    : (content?.about_it?.value_en || t.about.itDesc);

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div
          className="order-2 aspect-square rounded-[2rem] md:order-1 flex items-center justify-center"
          style={{ background: "var(--sand-surface)" }}
        >
          <span
            className="text-9xl font-light font-heading"
            style={{ color: "var(--sand-muted)", letterSpacing: "-0.02em" }}
          >
            F
          </span>
        </div>

        <div className="order-1 md:order-2">
          <div style={eyebrowStyle}>{t.about.title}</div>
          <h2
            className="mt-3 text-4xl font-medium leading-tight font-heading md:text-5xl"
            style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
          >
            {t.about.coachTitle}
          </h2>
          <p className="mt-6 leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
            {coachDesc}
          </p>
          <p className="mt-4 leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
            {itDesc}
          </p>
        </div>
      </div>
    </section>
  );
}
