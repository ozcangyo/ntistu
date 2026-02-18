"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  return (
    <main className="container-page">
      <form className="card max-w-md space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(Object.fromEntries(form)), headers: { "Content-Type": "application/json" } });
        setMessage(res.ok ? "Registered. Go to login." : "Failed.");
      }}>
        <h1 className="text-xl font-bold">Register</h1>
        <input className="input" name="email" placeholder="Email" />
        <input className="input" name="password" type="password" placeholder="Password" />
        <input className="input" name="timezone" placeholder="Timezone e.g. UTC" defaultValue="UTC" />
        <button className="btn" type="submit">Create account</button>
        <p>{message}</p>
      </form>
    </main>
  );
}
