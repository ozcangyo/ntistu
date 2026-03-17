import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminMedEdit({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return <main className="container-page">Forbidden</main>;
  const med = await prisma.medicationMaster.findUnique({ where: { id: params.id }, include: { sourceLinks: true } });
  if (!med) return <main className="container-page">Not found</main>;
  const rules = await prisma.interactionRule.findMany({ take: 20, orderBy: { id: "desc" } });
  return <main className="container-page space-y-4">
    <form className="card grid md:grid-cols-2 gap-2" action={`/api/admin/medications/${med.id}`} method="post">
      <input type="hidden" name="_method" value="put" />
      {Object.entries({drugName:med.drugName,brandName:med.brandName||'',activeIngredient:med.activeIngredient,drugClass:med.drugClass,indications:med.indications,sideEffectsCommon:med.sideEffectsCommon,sideEffectsSerious:med.sideEffectsSerious,contraindications:med.contraindications,warningsPregnancy:med.warningsPregnancy,warningsRenal:med.warningsRenal,warningsHepatic:med.warningsHepatic}).map(([k,v])=><input key={k} name={k} defaultValue={v} className="input" />)}
      <label><input type="checkbox" name="isVisible" defaultChecked={med.isVisible} /> Visible</label>
      <button className="btn md:col-span-2">Save</button>
    </form>
    <form className="card" action={`/api/admin/medications/${med.id}`} method="post">
      <input type="hidden" name="_method" value="delete" />
      <button className="btn bg-red-600">Delete medication</button>
    </form>
    <form className="card grid md:grid-cols-3 gap-2" action={`/api/admin/medications/${med.id}`} method="post">
      <input type="hidden" name="_method" value="patch" />
      <input className="input" name="sourceType" placeholder="url or doi" />
      <input className="input" name="sourceValue" placeholder="https://... or DOI" />
      <input className="input" name="sourceLabel" placeholder="label" />
      <button className="btn md:col-span-3">Add source link</button>
    </form>
    <form className="card grid md:grid-cols-2 gap-2" action="/api/admin/medications/rules" method="post">
      <input name="kind" className="input" placeholder="DRUG_DRUG" /><input name="a" className="input" placeholder="a" /><input name="b" className="input" placeholder="b" /><input name="riskLevel" className="input" placeholder="HIGH" /><input name="mechanism" className="input" placeholder="mechanism" /><input name="recommendation" className="input" placeholder="recommendation" />
      <button className="btn md:col-span-2">Add interaction rule</button>
    </form>
    <div className="card"><h3 className="font-semibold">Sources</h3><ul className="list-disc ml-5">{med.sourceLinks.map(s=><li key={s.id}>{s.type}: {s.value}</li>)}</ul></div>
    <div className="card"><h3 className="font-semibold">Recent rules</h3><ul className="list-disc ml-5">{rules.map(r=><li key={r.id}>{r.a} + {r.b} = {r.riskLevel}</li>)}</ul></div>
  </main>;
}
