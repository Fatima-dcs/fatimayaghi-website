import Head from "next/head";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { WhyArabic } from "@/components/landing/WhyArabic";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { HowItWorks } from "@/components/landing/HowItWorks";
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
      </Head>
      <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <WhyArabic />
        <About />
        <Services />
        <HowItWorks />
        <Booking />
        <Footer />
      </div>
    </>
  );
}
