import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q ?? "";
  const meds = await prisma.medicationMaster.findMany({
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

  return (
    <main className="container-page space-y-4">
      <section className="card">
        <h1 className="text-2xl font-bold">MedAI</h1>
        <p>Educational medication support. No diagnosis or prescribing.</p>
        <form className="mt-4 flex gap-2">
          <input className="input" name="q" defaultValue={q} placeholder="Search by drug, ingredient, class" />
          <button className="btn" type="submit">Search</button>
        </form>
      </section>
      <section className="grid md:grid-cols-2 gap-3">
        {meds.map((m) => (
          <Link className="card block" key={m.id} href={`/drugs/${m.id}`}>
            <div className="font-semibold">{m.drugName}</div>
            <div className="text-sm text-slate-600">{m.activeIngredient} · {m.drugClass}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
