"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!q.trim()) { setItems([]); return; }
      setLoading(true);
      const res = await fetch(`/api/public/drug-search?q=${encodeURIComponent(q)}`);
      const data = await res.json().catch(() => ({ items: [] }));
      setItems(data.items || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [q]);

  return (
    <main className="container-page space-y-6">
      <section className="card relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-violet-500/20 blur-2xl" />
        <h1 className="text-4xl font-extrabold tracking-tight">{t("heroTitle")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">{t("heroDesc")}</p>
        <div className="mt-4 flex gap-2">
          <Link className="btn" href="/auth/register">{t("startNow")}</Link>
          <Link className="px-4 py-2 rounded-xl border" href="/chat">{t("aiDoctor")}</Link>
        </div>
      </section>

      <section className="card">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} />
        {loading && <p className="text-sm mt-2">Searching...</p>}
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => (
          m.external ? (
            <div className="card" key={m.id}>
              <div className="font-semibold text-lg">{m.drugName}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{m.activeIngredient}</div>
              <span className="badge mt-3">{m.drugClass}</span>
              <p className="text-xs mt-2">External reference (openFDA)</p>
            </div>
          ) : (
            <Link className="card block hover:-translate-y-0.5 transition-transform" key={m.id} href={`/drugs/${m.id}`}>
              <div className="font-semibold text-lg">{m.drugName}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{m.activeIngredient}</div>
              <span className="badge mt-3">{m.drugClass}</span>
            </Link>
          )
        ))}
      </section>
    </main>
  );
}
