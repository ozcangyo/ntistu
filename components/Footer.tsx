"use client";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-12 border-t border-slate-200/60 dark:border-slate-800/80">
      <div className="container-page text-sm text-slate-500 dark:text-slate-400 flex justify-between">
        <p>MedAI — {t("footerTag")}</p>
        <p>Ozjan Mahmoud</p>
      </div>
    </footer>
  );
}
