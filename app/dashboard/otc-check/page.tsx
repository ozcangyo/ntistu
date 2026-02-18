"use client";
import { useState } from "react";

export default function OtcCheckPage() {
  const [result, setResult] = useState<any>(null);
  return <main className="container-page">
    <div className="card space-y-3">
      <h1 className="text-xl font-bold">OTC & Supplement checker</h1>
      <form onSubmit={async(e)=>{e.preventDefault(); const otc=(new FormData(e.currentTarget).get("otc") as string); const res=await fetch('/api/otc-check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({otc})}); setResult(await res.json());}} className="space-y-2">
        <input className="input" name="otc" placeholder="e.g. ibuprofen" />
        <button className="btn">Check safety</button>
      </form>
      {result && <div className="border rounded p-3"><p>Risk: <b>{result.riskLevel}</b></p><p>{result.explanation}</p><p>{result.actions}</p></div>}
    </div>
  </main>;
}
