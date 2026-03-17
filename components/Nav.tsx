"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Nav({ role, email }: { role?: "USER" | "ADMIN"; email?: string | null }) {
  const { t } = useLanguage();
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/65 dark:bg-slate-950/60 backdrop-blur-xl">
      <div className="container-page flex gap-4 items-center">
        <Link href="/" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">{t("brand")}</Link>
        <Link href="/dashboard" className="hover:text-blue-600">{t("dashboard")}</Link>
        <Link href="/chat" className="hover:text-blue-600">{t("aiDoctor")}</Link>
        {role === "ADMIN" && <Link href="/admin" className="hover:text-blue-600">{t("admin")}</Link>}
        {!email && <Link href="/auth/login" className="hover:text-blue-600">{t("login")}</Link>}
        {!email && <Link href="/auth/register" className="hover:text-blue-600">{t("register")}</Link>}
        <div className="ml-auto flex items-center gap-2">
          {email && <span className="badge">{email}</span>}
          {email && <button className="px-3 py-1.5 rounded-xl border text-sm" onClick={() => signOut({ callbackUrl: "/" })}>{t("logout")}</button>}
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
