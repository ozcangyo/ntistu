import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q ?? "";

  let meds: Array<{ id: string; drugName: string; activeIngredient: string; drugClass: string }> = [];
  try {
    meds = await prisma.medicationMaster.findMany({
      where: {
        isVisible: true,
        OR: [
          { drugName: { contains: q, mode: "insensitive" } },
          { activeIngredient: { contains: q, mode: "insensitive" } },
          { drugClass: { contains: q, mode: "insensitive" } }
        ]
      },
      take: 30,
      orderBy: { drugName: "asc" }
    });
  } catch {
    meds = [];
  }

  return (
    <main className="container-page space-y-6">
      <section className="card relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-violet-500/20 blur-2xl" />
        <h1 className="text-4xl font-extrabold tracking-tight">MedAI</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">Smart medication companion with AI chat, reminders, adherence tracking, OTC safety checks, and triage support.</p>
        <div className="mt-4 flex gap-2">
          <Link className="btn" href="/auth/register">Get Started</Link>
          <Link className="px-4 py-2 rounded-xl border" href="/chat">Open AI Doctor</Link>
        </div>
      </section>

      <section className="card">
        <form className="flex gap-2">
          <input className="input" name="q" defaultValue={q} placeholder="Search by drug, ingredient, class" />
          <button className="btn" type="submit">Search</button>
        </form>
      </section>

      {!meds.length && <section className="card">Medication list unavailable right now (DB not configured). UI preview is active.</section>}

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meds.map((m) => (
          <Link className="card block hover:-translate-y-0.5 transition-transform" key={m.id} href={`/drugs/${m.id}`}>
            <div className="font-semibold text-lg">{m.drugName}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{m.activeIngredient}</div>
            <span className="badge mt-3">{m.drugClass}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
