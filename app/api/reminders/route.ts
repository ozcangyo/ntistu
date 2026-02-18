import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { doseScheduleId, action } = await req.json();
  const status = action === "TAKEN" ? "TAKEN" : action === "SNOOZE" ? "SNOOZED" : "MISSED";
  await prisma.doseSchedule.update({ where: { id: doseScheduleId }, data: { status } });
  await prisma.doseLog.create({ data: { doseScheduleId, action: status === "SNOOZED" ? "SNOOZED" : status as any, note: status === "MISSED" ? "Never double dose. Check leaflet and ask pharmacist if unsure." : undefined } });
  return NextResponse.json({ guidance: status === "MISSED" ? "Never double dose. Check label/leaflet. Consult pharmacist if unsure." : null });
}
