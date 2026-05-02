import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LangState {
  lang: "en" | "ar";
  setLang: (lang: "en" | "ar") => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
    }),
    { name: "lang-preference" }
  )
);
