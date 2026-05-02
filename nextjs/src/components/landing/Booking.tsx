import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "9613763316";

export function Booking() {
  const { t } = useTranslation();

  return (
    <section id="booking" className="py-20 px-4 sm:px-6 bg-teal-600">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">{t.booking.title}</h2>
        <p className="text-teal-100 text-lg">{t.booking.subtitle}</p>

        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          <iframe
            src="https://calendly.com/fatima-ali-yaghi-1987"
            width="100%"
            height="600"
            frameBorder="0"
          />
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-teal-700 border-white hover:bg-teal-50 rounded-full px-8 mt-4"
          >
            💬 {t.booking.whatsapp}
          </Button>
        </a>
      </div>
    </section>
  );
}
