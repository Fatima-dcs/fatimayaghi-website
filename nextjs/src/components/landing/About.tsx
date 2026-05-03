import { useTranslation } from "@/lib/i18n";
import { api } from "@/utils/api";

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
    <section id="about" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-stone-800 text-center mb-12">{t.about.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-teal-50 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white text-2xl">🌿</div>
            <h3 className="text-xl font-bold text-teal-800">{t.about.coachTitle}</h3>
            <p className="text-stone-600 leading-relaxed">{coachDesc}</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 bg-stone-600 rounded-xl flex items-center justify-center text-white text-2xl">💡</div>
            <h3 className="text-xl font-bold text-stone-800">{t.about.itTitle}</h3>
            <p className="text-stone-600 leading-relaxed">{itDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
