import { api } from "@/utils/api";

const FALLBACK = `أنا فاطمة ياغي، من الجنوب اللبناني. رأيت بأم عيني كيف تتحمل المرأة اللبنانية أثقالاً لا تُحتمل — الحروب، الأزمات، والضغوط اليومية — وتبقى صامدة، لكنها في الداخل تبحث عن صوتها وعن حياة تستحقها.

هذا هو سبب رحلتي في الكوتشينغ. لأن كل امرأة تستحق مساحة آمنة تُسمع فيها، وأدوات حقيقية تساعدها على بناء مستقبلها بيدها. أنا هنا لأكون شريكتك في هذه الرحلة.`;

export function WhyArabic() {
  const { data: content } = api.content.list.useQuery();
  const text = content?.why_arabic?.value_ar || FALLBACK;
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <section dir="rtl" lang="ar" className="bg-amber-50 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-amber-900">
          لماذا أفعل هذا؟
        </h2>
        <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
        {paragraphs.map((para, i) => (
          <p key={i} className="text-lg text-amber-800 leading-loose">{para}</p>
        ))}
        <p className="text-base text-amber-700 font-medium italic">
          — فاطمة ياغي
        </p>
      </div>
    </section>
  );
}
