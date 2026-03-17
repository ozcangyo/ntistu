import { prisma } from "@/lib/prisma";

export default async function ComparePage({ searchParams }: { searchParams: { a?: string; b?: string } }) {
  const meds = await prisma.medicationMaster.findMany({ where: { isVisible: true }, orderBy: { drugName: "asc" } });
  const a = meds.find((m) => m.id === searchParams.a);
  const b = meds.find((m) => m.id === searchParams.b);
  return <main className="container-page space-y-4">
    <form className="card grid grid-cols-2 gap-2">
      <select name="a" className="input">{meds.map(m=><option key={m.id} value={m.id}>{m.drugName}</option>)}</select>
      <select name="b" className="input">{meds.map(m=><option key={m.id} value={m.id}>{m.drugName}</option>)}</select>
      <button className="btn col-span-2">Compare</button>
    </form>
    <div className="grid md:grid-cols-2 gap-3">
      {[a,b].map((m,i)=>m?<div key={i} className="card"><h2 className="font-semibold">{m.drugName}</h2><p>{m.indications}</p></div>:null)}
    </div>
  </main>;
}
