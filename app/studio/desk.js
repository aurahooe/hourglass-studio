"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
export default function StudioDesk({ profile, notes }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Session expired."); setBusy(false); return; }
    const { error } = await supabase.from("notes").insert({ user_id: user.id, title: title.trim() || "Untitled", body: body.trim(), is_public: isPublic });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setTitle(""); setBody("");
    router.refresh();
  }
  async function togglePublic(note) {
    await supabase.from("notes").update({ is_public: !note.is_public }).eq("id", note.id);
    router.refresh();
  }
  async function remove(id) {
    await supabase.from("notes").delete().eq("id", id);
    router.refresh();
  }
  return (
    <>
      <div className="studio-head">
        <div><p className="kicker">Your desk</p><h1>{profile?.display_name || "Studio"}</h1></div>
        <p className="lede" style={{ margin: 0 }}>Drafts stay closed. Flip a piece public and it appears on the wall for anyone.</p>
      </div>
      <form className="panel" style={{ margin: "0 0 40px", maxWidth: "none" }} onSubmit={save}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>The piece</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        <label className="toggle">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Show this on the public wall
        </label>
        <p className="err">{err}</p>
        <button className="btn" disabled={busy} type="submit">{busy ? "Keeping…" : "Keep this"}</button>
      </form>
      <div className="grid">
        {notes.map((n) => (
          <div key={n.id} className="piece">
            <h3><Link href={`/n/${n.id}`}>{n.title}</Link></h3>
            <p className="excerpt">{n.body}</p>
            <div className="meta">
              <span>{n.is_public ? "On the wall" : "Private"}</span>
              <span>
                <button className="btn ghost" type="button" onClick={() => togglePublic(n)}>{n.is_public ? "Hide" : "Publish"}</button>{" "}
                <button className="btn ghost" type="button" onClick={() => remove(n.id)}>Burn</button>
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
