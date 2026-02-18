"use client";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function RegisterPage() {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="container-page">
      <form className="card max-w-md space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(Object.fromEntries(form)), headers: { "Content-Type": "application/json" } });
        const data = await res.json().catch(() => ({}));
        if (res.ok) setMessage(`${t("register")} successful. ${t("login")}.`);
        else setError(data.error || "Failed.");
      }}>
        <h1 className="text-xl font-bold">{t("register")}</h1>
        <input className="input" name="email" placeholder="Email" required />
        <input className="input" name="password" type="password" placeholder="Password (min 8 chars)" required minLength={8} />
        <input className="input" name="timezone" placeholder="Timezone e.g. UTC" defaultValue="UTC" />
        <button className="btn" type="submit">{t("register")}</button>
        {message && <p className="text-green-700">{message}</p>}
        {error && <p className="text-red-700">{error}</p>}
      </form>
    </main>
  );
}
