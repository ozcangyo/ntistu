"use client";
import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  return <main className="container-page space-y-4">
    <div className="card">
      <h1 className="text-2xl font-bold">AI Doctor Chat</h1>
      <p className="text-sm text-amber-700 dark:text-amber-300">Educational only. No diagnosis/prescription. For full context-aware answers, login and add regimen.</p>
      <form onSubmit={async(e)=>{
        e.preventDefault();
        setLoading(true);
        const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
        setResponse(await res.json());
        setLoading(false);
      }} className="space-y-2 mt-3">
        <textarea className="input min-h-28" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about meds, interactions, next dose, or symptoms" />
        <button className="btn" disabled={loading}>{loading ? 'Thinking...' : 'Send'}</button>
      </form>
    </div>

    {response?.emergencyBanner && <div className="card bg-red-100 dark:bg-red-900/40 border-red-500"><b>{response.emergencyBanner}</b></div>}
    {response?.requiresLoginForFullContext && <div className="card border-amber-400">Login required for personal regimen context. Current answer is generic.</div>}

    {response && <div className="card whitespace-pre-wrap">
      <h2 className="font-semibold mb-2">Response</h2>
      {Object.entries(response.sections || {}).map(([k,v]) => <div key={k} className="mb-2"><p className="font-medium capitalize">{k}</p><pre className="text-sm whitespace-pre-wrap">{typeof v === 'string' ? v : JSON.stringify(v, null, 2)}</pre></div>)}
      <p className="mt-2 text-sm">{response.disclaimer}</p>
    </div>}
  </main>;
}
