import Head from "next/head";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Fatima Yaghi Coaching</title>
      </Head>
      <div
        className="min-h-screen py-16 px-6"
        style={{ background: "var(--sand-bg)", color: "var(--sand-ink)" }}
      >
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--sand-ink-soft)" }}
          >
            ← Back
          </Link>

          <h1
            className="mt-8 text-4xl font-medium font-heading"
            style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}
          >
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--sand-ink-soft)" }}>
            Last updated: June 2026
          </p>

          <div className="mt-10 space-y-8 leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                1. Who we are
              </h2>
              <p>
                This website is operated by Fatima Yaghi, a personal life and executive coach based in Amsterdam, the Netherlands. You can contact me at{" "}
                <a href="mailto:fatima.ali.yaghi.1987@gmail.com" className="underline hover:opacity-70">
                  fatima.ali.yaghi.1987@gmail.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                2. What data we collect and why
              </h2>
              <p>When you use this website, we may collect:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li><strong>Name and email address</strong> — when you book a session via Calendly or register as a client. Lawful basis: contract performance.</li>
                <li><strong>Session notes and action items</strong> — created by me and attached to your client record. Lawful basis: contract performance and legitimate interest (coaching delivery).</li>
                <li><strong>EQi 2.0 assessment results</strong> — only when you complete an assessment as part of our coaching engagement. Lawful basis: explicit consent.</li>
                <li><strong>Usage data</strong> — basic analytics if you have consented to analytics cookies. Lawful basis: consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                3. How we store your data
              </h2>
              <p>
                Client data is stored in Supabase (EU region), a managed PostgreSQL database service. Session scheduling data is processed by Calendly, whose privacy policy applies to that interaction. No client data is sold or shared with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                4. How long we keep your data
              </h2>
              <p>
                We retain your data for as long as our coaching relationship is active, plus up to 2 years after the last session, unless you request earlier deletion. Session notes are kept in line with ICF confidentiality guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                5. Your rights (GDPR)
              </h2>
              <p>Under the GDPR, you have the right to:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate data</li>
                <li>Request erasure of your data ("right to be forgotten")</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time (where processing is based on consent)</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email{" "}
                <a href="mailto:fatima.ali.yaghi.1987@gmail.com" className="underline hover:opacity-70">
                  fatima.ali.yaghi.1987@gmail.com
                </a>. We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                6. Cookies
              </h2>
              <p>
                We use essential cookies to keep the site functioning (authentication, session state). With your consent, we may also use analytics cookies. You can change your cookie preference at any time by clearing your browser's local storage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                7. Contact & complaints
              </h2>
              <p>
                For privacy questions, contact{" "}
                <a href="mailto:fatima.ali.yaghi.1987@gmail.com" className="underline hover:opacity-70">
                  fatima.ali.yaghi.1987@gmail.com
                </a>. If you are unhappy with how we handle your data, you have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) at{" "}
                <span className="underline">autoriteitpersoonsgegevens.nl</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
