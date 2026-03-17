"use client";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ReminderActions({ schedules }: { schedules: { id: string; drug: string; when: string }[] }) {
  const router = useRouter();
  const { t } = useLanguage();

  async function act(id: string, action: string) {
    const res = await fetch("/api/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doseScheduleId: id, action }) });
    const data = await res.json();
    if (data.guidance) alert(data.guidance);
    router.refresh();
  }

  if (!schedules.length) return <p className="text-sm">{t("noPendingDoses")}</p>;
  return <ul className="space-y-2">{schedules.map((s) => <li key={s.id} className="border rounded p-2"><p>{s.drug} @ {new Date(s.when).toLocaleString()}</p>
    <div className="flex gap-2 mt-2"><button className="btn" onClick={() => act(s.id, "TAKEN")}>Taken</button><button className="btn bg-amber-600" onClick={() => act(s.id, "SNOOZE")}>Snooze</button><button className="btn bg-red-600" onClick={() => act(s.id, "MISSED")}>Missed</button></div>
  </li>)}</ul>;
}
