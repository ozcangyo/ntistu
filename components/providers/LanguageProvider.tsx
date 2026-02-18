"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionary, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dictionary.en) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (localStorage.getItem("medai_lang") as Lang | null) || "en";
    setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("medai_lang", l);
    document.cookie = `medai_lang=${l};path=/;max-age=31536000`;
  };

  const value = useMemo(() => ({
    lang,
    setLang,
    t: (k: keyof typeof dictionary.en) => dictionary[lang][k] || dictionary.en[k]
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
