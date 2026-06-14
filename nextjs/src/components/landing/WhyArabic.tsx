import { api } from "@/utils/api";

const FALLBACK = `أنا فاطمة ياغي، من الجنوب اللبناني. رأيت بأم عيني كيف تتحمل المرأة اللبنانية أثقالاً لا تُحتمل — الحروب، الأزمات، والضغوط اليومية — وتبقى صامدة، لكنها في الداخل تبحث عن صوتها وعن حياة تستحقها.

هذا هو سبب رحلتي في الكوتشينغ. لأن كل امرأة تستحق مساحة آمنة تُسمع فيها، وأدوات حقيقية تساعدها على بناء مستقبلها بيدها. أنا هنا لأكون شريكتك في هذه الرحلة.`;

export function WhyArabic() {
  const { data: content } = api.content.list.useQuery();
  const text = content?.why_arabic?.value_ar || FALLBACK;
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <section
      dir="rtl"
      lang="ar"
      className="py-20 px-6"
      style={{ background: "var(--sand-surface)" }}
    >
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div
          style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sand-accent)",
          }}
        >
          القصة
        </div>
        <h2
          className="text-3xl font-medium font-heading"
          style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
        >
          لماذا أفعل هذا؟
        </h2>
        <div
          className="w-16 h-0.5 mx-auto rounded-full"
          style={{ background: "var(--sand-muted)" }}
        />
        {paragraphs.map((para, i) => (
          <p key={i} className="text-lg leading-loose" style={{ color: "var(--sand-ink-soft)" }}>
            {para}
          </p>
        ))}
        <p className="text-base font-medium italic" style={{ color: "var(--sand-accent)" }}>
          — فاطمة ياغي
        </p>
      </div>
    </section>
  );
}
