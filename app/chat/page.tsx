"use client";
import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitChat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(text || "Non-JSON response from server");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse(null);
      setError("AI doctor response could not be parsed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return <main className="container-page space-y-4">
    <div className="card">
      <h1 className="text-2xl font-bold">AI Doctor Chat</h1>
      <p className="text-sm text-amber-700 dark:text-amber-300">Educational only. No diagnosis/prescription. For full context-aware answers, login and add regimen.</p>
      <form onSubmit={submitChat} className="space-y-2 mt-3">
        <textarea className="input min-h-28" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about meds, interactions, next dose, or symptoms" />
        <button className="btn" disabled={loading}>{loading ? "Thinking..." : "Send"}</button>
      </form>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>

    {response?.emergencyBanner && <div className="card bg-red-100 dark:bg-red-900/40 border-red-500"><b>{response.emergencyBanner}</b></div>}
    {response?.requiresLoginForFullContext && <div className="card border-amber-400">Login required for personal regimen context. Current answer is generic.</div>}

    {response && <div className="card whitespace-pre-wrap">
      <h2 className="font-semibold mb-2">Response</h2>
      {Object.entries(response.sections || {}).map(([k,v]) => <div key={k} className="mb-2"><p className="font-medium capitalize">{k}</p><pre className="text-sm whitespace-pre-wrap">{typeof v === "string" ? v : JSON.stringify(v, null, 2)}</pre></div>)}
      <p className="mt-2 text-sm">{response.disclaimer}</p>
    </div>}
  </main>;
}
