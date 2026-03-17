import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminMeds() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return <main className="container-page">Forbidden</main>;
  const meds = await prisma.medicationMaster.findMany({ orderBy: { updatedAt: "desc" } });
  return <main className="container-page space-y-4">
    <form className="card grid md:grid-cols-2 gap-2" action="/api/admin/medications" method="post">
      <h1 className="text-xl font-bold md:col-span-2">Create medication</h1>
      {['drugName','brandName','activeIngredient','drugClass','indications','sideEffectsCommon','sideEffectsSerious','contraindications','warningsPregnancy','warningsRenal','warningsHepatic'].map(f=><input key={f} name={f} placeholder={f} className="input" required={f!=='brandName'} />)}
      <button className="btn md:col-span-2">Create</button>
    </form>
    <div className="card"><ul className="list-disc ml-5">{meds.map(m=><li key={m.id}><Link className="underline" href={`/admin/medications/${m.id}`}>{m.drugName}</Link> ({m.isVisible ? 'visible':'hidden'})</li>)}</ul></div>
  </main>;
}
