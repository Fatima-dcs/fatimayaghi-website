import { useTranslation } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { eyebrowStyle } from "./styles";

export function FAQ() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
      <div style={eyebrowStyle}>{t.faq.eyebrow}</div>
      <h2
        className="mt-3 text-4xl font-medium leading-tight font-heading md:text-5xl"
        style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
      >
        {t.faq.title}
      </h2>

      <Accordion type="single" collapsible className="mt-12">
        {t.faq.items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            style={{ borderColor: "var(--sand-muted)" }}
          >
            <AccordionTrigger
              className="text-lg font-medium font-heading text-start hover:no-underline py-6"
              style={{ color: "var(--sand-ink)" }}
            >
              {item.q}
            </AccordionTrigger>
            <AccordionContent
              className="leading-relaxed pb-6"
              style={{ color: "var(--sand-ink-soft)" }}
            >
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
