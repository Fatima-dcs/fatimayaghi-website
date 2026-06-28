import Head from "next/head";
import Link from "next/link";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service — Fatima Yaghi Coaching</title>
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
            Terms of Service
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--sand-ink-soft)" }}>
            Last updated: June 2026
          </p>

          <div className="mt-10 space-y-8 leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                1. Service
              </h2>
              <p>
                This website is operated by Fatima Yaghi ("the Coach"), providing personal life and executive coaching services. By accessing the site or using the client portal, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                2. Coaching relationship
              </h2>
              <p>
                Coaching is a professional relationship that supports clients in achieving personal and professional goals. Coaching is not therapy, counselling, or medical advice. The Coach will refer you to appropriate professionals if your needs fall outside the scope of coaching.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                3. Confidentiality
              </h2>
              <p>
                All coaching conversations and session notes are kept strictly confidential, in line with the ICF Code of Ethics. Information will only be disclosed if required by law or to prevent serious harm.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                4. Sessions and cancellations
              </h2>
              <p>
                Sessions are scheduled via Calendly. Please cancel or reschedule at least 24 hours in advance. Late cancellations or no-shows may be counted as a completed session.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                5. Client portal
              </h2>
              <p>
                Access to the client portal is by invitation only. You are responsible for keeping your login credentials secure. The Coach reserves the right to revoke access at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                6. Intellectual property
              </h2>
              <p>
                All coaching materials, tools, and content available in the portal are the intellectual property of Fatima Yaghi and are provided for personal use only. They may not be reproduced or distributed without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                7. Limitation of liability
              </h2>
              <p>
                The Coach is not liable for any decisions made by the client as a result of coaching sessions. The client takes full responsibility for their own choices and outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                8. Governing law
              </h2>
              <p>
                These terms are governed by Dutch law. Any disputes will be subject to the jurisdiction of the courts of Amsterdam, the Netherlands.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium font-heading mb-3" style={{ color: "var(--sand-ink)" }}>
                9. Contact
              </h2>
              <p>
                Questions about these terms?{" "}
                <a href="mailto:fatima.ali.yaghi.1987@gmail.com" className="underline hover:opacity-70">
                  fatima.ali.yaghi.1987@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
