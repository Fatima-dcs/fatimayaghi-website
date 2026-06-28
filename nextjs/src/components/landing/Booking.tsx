import { useTranslation } from "@/lib/i18n";

const WHATSAPP_NUMBER = "9613763316";

export function Booking() {
  const { t, lang } = useTranslation();

  return (
    <section id="booking" className="mx-auto max-w-6xl px-6 pb-24">
      <div
        className="rounded-[2.5rem] px-10 py-16"
        style={{ background: "var(--sand-surface)" }}
      >
        <div
          style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sand-accent)",
            textAlign: "center",
          }}
        >
          {lang === "ar" ? "الحجز" : "Book"}
        </div>
        <h2
          className="mx-auto mt-3 max-w-2xl text-4xl font-medium leading-tight font-heading text-center md:text-5xl"
          style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
        >
          {t.booking.title}
        </h2>
        <p className="text-center mt-4 mb-10" style={{ color: "var(--sand-ink-soft)" }}>
          {t.booking.subtitle}
        </p>

        <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_-16px_rgba(43,38,34,0.2)]">
          <iframe
            src="https://calendly.com/fatima-ali-yaghi-1987"
            width="100%"
            height="600"
            frameBorder="0"
          />
        </div>

        <div className="mt-8 text-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition hover:-translate-y-0.5"
            style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink)" }}
          >
            💬 {t.booking.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
