import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DrugPage({ params }: { params: { id: string } }) {
  const med = await prisma.medicationMaster.findUnique({ where: { id: params.id }, include: { sourceLinks: true } });
  if (!med) notFound();

  return (
    <main className="container-page space-y-4">
      <div className="card">
        <h1 className="text-2xl font-bold">{med.drugName}</h1>
        <p className="text-sm text-slate-600">{med.brandName} · {med.activeIngredient} · {med.drugClass}</p>
      </div>
      {[
        ["Indications", med.indications],
        ["Common side effects", med.sideEffectsCommon],
        ["Serious side effects", med.sideEffectsSerious],
        ["Contraindications", med.contraindications],
        ["Pregnancy", med.warningsPregnancy],
        ["Renal", med.warningsRenal],
        ["Hepatic", med.warningsHepatic]
      ].map(([title, value]) => (
        <div className="card" key={title as string}><h2 className="font-semibold">{title}</h2><p>{value}</p></div>
      ))}
      <div className="card">
        <h2 className="font-semibold">Source links</h2>
        <ul className="list-disc ml-5">
          {med.sourceLinks.map((s) => <li key={s.id}><a className="text-blue-700 underline" href={s.value}>{s.label || s.value} ({s.type})</a></li>)}
        </ul>
      </div>
    </main>
  );
}
