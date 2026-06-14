export const en = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    book: "Book a Session",
    signIn: "Sign In",
  },
  hero: {
    headline: "Unlock Your Potential",
    subheadline: "Executive coaching for Lebanese women ready to rise above challenges and build the life they deserve.",
    cta: "Book a Free Discovery Call",
    badge: "ICF ACC Candidate — Executive Coaching",
  },
  about: {
    title: "About Fatima",
    coachTitle: "Executive Coach",
    coachDesc: "Completing my executive coaching training and working toward my ICF ACC certification, I bring evidence-based coaching tools to help you gain clarity, overcome obstacles, and move forward with confidence.",
    itTitle: "IT Professional & Product Owner",
    itDesc: "With years of experience as a Product Owner in tech, I also help non-IT people use AI tools and productivity hacks to work smarter — not harder.",
  },
  services: {
    title: "How I Can Help",
    coaching: {
      title: "1-on-1 Coaching Sessions",
      desc: "Private coaching sessions tailored to your goals. Available at a discounted rate as I complete my ICF certification hours.",
      price: "Discounted Rate",
      tag: "Limited spots",
    },
    ai: {
      title: "AI & Productivity Workshop",
      desc: "Learn how to use AI tools to create pitches, build roadmaps, and generate POCs — even if you have no technical background.",
      price: "Coming Soon",
      tag: "Non-technical friendly",
    },
  },
  howItWorks: {
    title: "How It Works",
    steps: [
      { num: "01", title: "Book a Call", desc: "Choose a time that works for you using the booking form below." },
      { num: "02", title: "Meet on Google Meet", desc: "We connect via Google Meet for your coaching session from anywhere." },
      { num: "03", title: "Your Personal Dashboard", desc: "Access session summaries, action items, and coaching tools anytime." },
    ],
  },
  booking: {
    title: "Ready to Start?",
    subtitle: "Book your free discovery call or reach out on WhatsApp.",
    calendlyPlaceholder: "Booking calendar loading...",
    whatsapp: "Chat on WhatsApp",
  },
  testimonials: {
    eyebrow: "Clients",
    title: "What clients say.",
    items: [
      {
        quote: "Fatima helped me see what was actually holding me back — not what I thought it was. In six sessions I had a plan I believed in.",
        author: "R.H., Product Manager",
      },
      {
        quote: "I came in overwhelmed and left with clarity. Her approach is warm, direct, and nothing like what I expected coaching to be.",
        author: "N.K., Entrepreneur",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    items: [
      {
        q: "How long is a typical engagement?",
        a: "Most clients work with me for 6 to 8 sessions over 3–4 months. We always start with a free discovery call to see if it's the right fit.",
      },
      {
        q: "Do you coach in Arabic?",
        a: "Yes. Sessions can be in Arabic, English, or a mix — whatever feels most natural for you.",
      },
      {
        q: "What is the EQi 2.0 assessment?",
        a: "The EQ-i 2.0 is a scientifically validated emotional intelligence assessment. I use it to help clients understand their strengths and areas for growth — it gives our coaching a concrete starting point.",
      },
      {
        q: "Is this therapy?",
        a: "No. Coaching is forward-looking and action-oriented. I'll always refer you on if therapy is a better fit.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Let's see if we're a good fit.",
    subtitle: "A free 30-minute discovery call. No pitch, no pressure.",
    button: "Book a discovery call",
  },
  footer: {
    tagline: "Empowering Lebanese women to unlock their potential.",
    links: { privacy: "Privacy", terms: "Terms", support: "Support" },
    rights: "All rights reserved.",
  },
};

export type Translations = typeof en;
