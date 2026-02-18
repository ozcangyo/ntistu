import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nextDoseFromTimes } from "@/lib/schedule";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <main className="container-page">Please <Link href="/auth/login">login</Link>.</main>;

  const regimen = await prisma.userMedication.findMany({ where: { userId: session.user.id }, include: { medication: true } });
  const notifications = await prisma.inAppNotification.findMany({ where: { userId: session.user.id }, take: 10, orderBy: { createdAt: "desc" } });
  const pending = await prisma.doseSchedule.findMany({ where: { userMedication: { userId: session.user.id }, status: "PENDING" }, include: { userMedication: { include: { medication: true } } }, orderBy: { scheduledAt: "asc" }, take: 5 });
  const next = regimen[0] ? nextDoseFromTimes(regimen[0].scheduleTimes) : null;

  return <DashboardClient
    next={next ? { when: next.next.toISOString(), remaining: next.humanRemaining } : null}
    pending={pending.map((p) => ({ id: p.id, drug: p.userMedication.medication.drugName, when: p.scheduledAt.toISOString() }))}
    notifications={notifications.map((n) => ({ id: n.id, title: n.title, body: n.body }))}
  />;
}
