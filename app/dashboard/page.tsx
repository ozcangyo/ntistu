import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nextDoseFromTimes } from "@/lib/schedule";
import ReminderActions from "@/components/ReminderActions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <main className="container-page">Please <Link href="/auth/login">login</Link>.</main>;

  const regimen = await prisma.userMedication.findMany({ where: { userId: session.user.id }, include: { medication: true } });
  const notifications = await prisma.inAppNotification.findMany({ where: { userId: session.user.id }, take: 10, orderBy: { createdAt: "desc" } });
  const pending = await prisma.doseSchedule.findMany({ where: { userMedication: { userId: session.user.id }, status: "PENDING" }, include: { userMedication: { include: { medication: true } } }, orderBy: { scheduledAt: "asc" }, take: 5 });
  const next = regimen[0] ? nextDoseFromTimes(regimen[0].scheduleTimes) : null;

  return (
    <main className="container-page space-y-4">
      <div className="card"><h1 className="text-xl font-bold">Dashboard</h1>
        <p>Next dose due: {next ? `${next.next.toLocaleString()} (${next.humanRemaining})` : "No regimen yet"}</p>
      </div>
      <div className="flex gap-3">
        <Link className="btn" href="/dashboard/regimen">My Regimen</Link>
        <Link className="btn" href="/dashboard/adherence">Adherence</Link>
        <Link className="btn" href="/dashboard/otc-check">OTC checker</Link>
      </div>
      <div className="card"><h2 className="font-semibold">Due schedules</h2>
        <ReminderActions schedules={pending.map(p=>({id:p.id, drug:p.userMedication.medication.drugName, when:p.scheduledAt.toISOString()}))} />
      </div>
      <div className="card"><h2 className="font-semibold">Reminders</h2>
        <ul className="list-disc ml-5">{notifications.map(n => <li key={n.id}>{n.title}: {n.body}</li>)}</ul>
      </div>
    </main>
  );
}
