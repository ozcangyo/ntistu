"use client";
import { useEffect, useState } from "react";

export default function AdherencePage() {
  const [report, setReport] = useState<any>(null);
  useEffect(() => { fetch('/api/adherence').then(r=>r.json()).then(setReport); }, []);
  return <main className="container-page space-y-4">
    <div className="card"><h1 className="text-xl font-bold">Weekly adherence</h1>
      {report ? <div>
        <p>Scheduled: {report.totalScheduled}</p><p>Taken: {report.taken}</p><p>Missed: {report.missed}</p><p>Adherence: {report.adherencePercent}%</p>
        <p>Pattern: {report.pattern}</p>
        <a className="btn inline-block mt-2" href="/api/adherence?format=csv">Download weekly report (CSV)</a>
      </div> : <p>Loading report...</p>}
    </div>
  </main>;
}
