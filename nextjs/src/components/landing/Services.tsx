import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-20 px-4 sm:px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-stone-800 text-center mb-12">{t.services.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-4">
            <Badge className="bg-teal-50 text-teal-700 border-teal-200">{t.services.coaching.tag}</Badge>
            <h3 className="text-xl font-bold text-stone-800">{t.services.coaching.title}</h3>
            <p className="text-stone-600 leading-relaxed">{t.services.coaching.desc}</p>
            <p className="text-2xl font-bold text-teal-600">{t.services.coaching.price}</p>
            <a href="#booking" className="block">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full">
                {t.nav.book}
              </Button>
            </a>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-4 opacity-75">
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">{t.services.ai.tag}</Badge>
            <h3 className="text-xl font-bold text-stone-800">{t.services.ai.title}</h3>
            <p className="text-stone-600 leading-relaxed">{t.services.ai.desc}</p>
            <p className="text-2xl font-bold text-stone-400">{t.services.ai.price}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
