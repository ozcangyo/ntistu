"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import ReminderActions from "@/components/ReminderActions";

export default function DashboardClient({
  next,
  pending,
  notifications
}: {
  next: { when: string; remaining: string } | null;
  pending: { id: string; drug: string; when: string }[];
  notifications: { id: string; title: string; body: string }[];
}) {
  const { t } = useLanguage();

  return (
    <main className="container-page space-y-4">
      <div className="card"><h1 className="text-xl font-bold">{t("dashboard")}</h1>
        <p>{t("nextDoseDue")}: {next ? `${new Date(next.when).toLocaleString()} (${next.remaining})` : t("noRegimenYet")}</p>
      </div>
      <div className="flex gap-3">
        <Link className="btn" href="/dashboard/regimen">{t("myRegimen")}</Link>
        <Link className="btn" href="/dashboard/adherence">{t("adherence")}</Link>
        <Link className="btn" href="/dashboard/otc-check">{t("otcChecker")}</Link>
      </div>
      <div className="card"><h2 className="font-semibold">{t("dueSchedules")}</h2>
        <ReminderActions schedules={pending} />
      </div>
      <div className="card"><h2 className="font-semibold">{t("reminders")}</h2>
        <ul className="list-disc ml-5">{notifications.map((n) => <li key={n.id}>{n.title}: {n.body}</li>)}</ul>
      </div>
    </main>
  );
}
