import Head from "next/head";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { WhyArabic } from "@/components/landing/WhyArabic";
import { Booking } from "@/components/landing/Booking";
import { Footer } from "@/components/landing/Footer";
import { useLangStore } from "@/stores/use-lang-store";

export default function LandingPage() {
  const lang = useLangStore((s) => s.lang);

  return (
    <>
      <Head>
        <title>Fatima Yaghi — Life Coach</title>
        <meta
          name="description"
          content="Life coaching for Lebanese women ready to unlock their potential. Book a session with Fatima Yaghi."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Figtree:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="min-h-screen"
        style={{ background: "var(--sand-bg)", color: "var(--sand-ink)", fontFamily: "'Figtree', system-ui, sans-serif" }}
      >
        <Navbar />
        <Hero />
        <About />
        <Services />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
        <WhyArabic />
        <Booking />
        <Footer />
      </div>
    </>
  );
}
