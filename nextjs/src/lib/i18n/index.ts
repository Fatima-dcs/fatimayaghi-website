import { useLangStore } from "@/stores/use-lang-store";
import { en } from "./en";
import { ar } from "./ar";

export function useTranslation() {
  const lang = useLangStore((s) => s.lang);
  return { t: lang === "ar" ? ar : en, lang };
}
