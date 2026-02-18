// @ts-nocheck
const { prisma } = require("../lib/prisma");
const { addDays, set } = require("date-fns");

function parseTime(time, base) {
  const [h, m] = time.split(":").map(Number);
  return set(base, { hours: h, minutes: m, seconds: 0, milliseconds: 0 });
}

async function generateSchedules() {
  const users = await prisma.user.findMany({ include: { userMedications: true } });
  const now = new Date();
  for (const user of users) {
    const local = new Date(now.toLocaleString("en-US", { timeZone: user.timezone || "UTC" }));
    if (local.getHours() !== 0 || local.getMinutes() !== 5) continue;
    for (const um of user.userMedications) {
      for (let day = 0; day < 7; day++) {
        const d = addDays(now, day);
        for (const t of um.scheduleTimes) {
          const scheduledAt = parseTime(t, d);
          await prisma.doseSchedule.upsert({
            where: { userMedicationId_scheduledAt: { userMedicationId: um.id, scheduledAt } },
            create: { userMedicationId: um.id, scheduledAt },
            update: {}
          });
        }
      }
    }
  }
}

async function sendDueReminders() {
  const now = new Date();
  const oneMinAgo = new Date(now.getTime() - 60_000);
  const due = await prisma.doseSchedule.findMany({
    where: { status: "PENDING", scheduledAt: { gte: oneMinAgo, lte: now } },
    include: { userMedication: { include: { medication: true } } }
  });

  for (const d of due) {
    await prisma.inAppNotification.create({
      data: {
        userId: d.userMedication.userId,
        type: "REMINDER",
        title: "Dose due",
        body: `${d.userMedication.medication.drugName} is due now (${d.scheduledAt.toISOString()})`
      }
    });
  }
}

async function loop() {
  while (true) {
    try {
      await generateSchedules();
      await sendDueReminders();
      console.log("Worker tick", new Date().toISOString());
    } catch (e) {
      console.error("Worker error", e);
    }
    await new Promise((r) => setTimeout(r, 60_000));
  }
}

loop();
