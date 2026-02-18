"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="container-page">
      <form className="card max-w-md space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        const res = await signIn("credentials", { email, password, callbackUrl: "/dashboard", redirect: false });
        if (res?.error) setError("Invalid credentials");
        else window.location.href = "/dashboard";
      }}>
        <h1 className="text-xl font-bold">{t("login")}</h1>
        <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn" type="submit">{t("login")}</button>
      </form>
    </main>
  );
}
