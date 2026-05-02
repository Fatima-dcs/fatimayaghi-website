import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <div className="order-2 md:order-1 space-y-6">
          <Badge className="bg-teal-50 text-teal-700 border-teal-200">{t.hero.badge}</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 leading-tight">
            {t.hero.headline}
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
            {t.hero.subheadline}
          </p>
          <a href="#booking">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8">
              {t.hero.cta}
            </Button>
          </a>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            <Image
              src="/fatima.png"
              alt="Fatima Yaghi"
              fill
              className="object-cover rounded-full shadow-2xl border-4 border-teal-100"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
