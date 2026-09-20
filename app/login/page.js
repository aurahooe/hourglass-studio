"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const fn = mode === "in"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) { setErr(error.message); return; }
    router.push("/studio");
    router.refresh();
  }
  return (
    <div className="panel">
      <p className="kicker">{mode === "in" ? "Return" : "Begin"}</p>
      <h1 style={{ fontFamily: "Fraunces, Georgia, serif", marginTop: 0 }}>
        {mode === "in" ? "Come back in." : "Take a desk."}
      </h1>
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <label>Password</label>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} />
        <p className="err">{err}</p>
        <div className="row">
          <button className="btn" disabled={busy} type="submit">{busy ? "Working…" : mode === "in" ? "Enter" : "Create desk"}</button>
          <button type="button" className="btn ghost" onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? "I need a desk" : "I already have one"}
          </button>
        </div>
      </form>
    </div>
  );
}
