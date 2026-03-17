"use client";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <select className="px-2 py-1 rounded-xl border bg-transparent text-sm" value={lang} onChange={(e) => setLang(e.target.value as any)}>
      <option value="en">EN</option>
      <option value="tr">TR</option>
      <option value="ku">KU</option>
    </select>
  );
}
