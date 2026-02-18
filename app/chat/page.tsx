"use client";
import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);

  return <main className="container-page space-y-4">
    <div className="card"><h1 className="text-xl font-bold">AI Doctor Chat</h1>
      <p className="text-sm text-red-700">Educational only. Never for emergencies.</p>
      <form onSubmit={async(e)=>{e.preventDefault(); const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})}); setResponse(await res.json());}} className="space-y-2 mt-2">
        <textarea className="input" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about meds, next dose, or symptoms" />
        <button className="btn">Send</button>
      </form>
    </div>
    {response?.emergencyBanner && <div className="card bg-red-100 border-red-500"><b>{response.emergencyBanner}</b></div>}
    {response && <div className="card whitespace-pre-wrap">{JSON.stringify(response.sections, null, 2)}
      <p className="mt-2 text-sm">{response.disclaimer}</p>
    </div>}
  </main>;
}
