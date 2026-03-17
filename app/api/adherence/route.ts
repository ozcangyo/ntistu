import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const start = subDays(new Date(), 7);
  const schedules = await prisma.doseSchedule.findMany({
    where: { userMedication: { userId: session.user.id }, scheduledAt: { gte: start } },
    include: { userMedication: true }
  });

  const totalScheduled = schedules.length;
  const taken = schedules.filter((s) => s.status === "TAKEN").length;
  const missed = schedules.filter((s) => s.status === "MISSED").length;
  const morningMissed = schedules.filter((s) => s.status === "MISSED" && s.scheduledAt.getHours() < 12).length;
  const eveningMissed = schedules.filter((s) => s.status === "MISSED" && s.scheduledAt.getHours() >= 12).length;
  const adherencePercent = totalScheduled ? Math.round((taken / totalScheduled) * 100) : 0;

  const report = { totalScheduled, taken, missed, adherencePercent, pattern: morningMissed >= eveningMissed ? "most missed: morning doses" : "most missed: evening doses" };
  const format = new URL(req.url).searchParams.get("format");
  if (format === "csv") {
    const csv = `totalScheduled,taken,missed,adherencePercent,pattern\n${totalScheduled},${taken},${missed},${adherencePercent},"${report.pattern}"`;
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=weekly-adherence.csv" } });
  }
  return NextResponse.json(report);
}
