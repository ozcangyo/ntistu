import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function RegimenPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <main className="container-page">Login required.</main>;
  const meds = await prisma.medicationMaster.findMany({ where: { isVisible: true }, orderBy: { drugName: "asc" } });
  const regimen = await prisma.userMedication.findMany({ where: { userId: session.user.id }, include: { medication: true } });

  return <main className="container-page space-y-4">
    <form action="/api/regimen" method="post" className="card space-y-2">
      <h1 className="font-bold text-xl">Add to My Regimen</h1>
      <select name="medicationId" className="input">{meds.map(m => <option key={m.id} value={m.id}>{m.drugName}</option>)}</select>
      <input className="input" name="strength" placeholder="Strength e.g. 5mg" required />
      <input className="input" name="frequency" placeholder="Frequency e.g. twice daily" required />
      <input className="input" name="scheduleTimes" placeholder="08:00,20:00" required />
      <label className="flex gap-2"><input type="checkbox" name="withFood" />With food</label>
      <input className="input" type="date" name="startDate" required />
      <button className="btn" type="submit">Save</button>
    </form>
    <div className="card"><h2 className="font-semibold">Current regimen</h2>
    <ul className="list-disc ml-5">{regimen.map(r => <li key={r.id}>{r.medication.drugName} {r.strength} @ {r.scheduleTimes.join(", ")}</li>)}</ul></div>
  </main>;
}
