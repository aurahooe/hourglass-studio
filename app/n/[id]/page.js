import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
export const revalidate = 30;
export default async function NotePage({ params }) {
  const supabase = createClient();
  const { data: note } = await supabase
    .from("notes")
    .select("id,title,body,is_public,created_at,user_id,profiles(handle,display_name)")
    .eq("id", params.id)
    .maybeSingle();
  if (!note) notFound();
  return (
    <article className="long">
      <p className="kicker">{note.profiles?.display_name || note.profiles?.handle || "anon"} · {new Date(note.created_at).toLocaleString("en-GB")}{note.is_public ? " · public" : " · private"}</p>
      <h1>{note.title}</h1>
      <div className="prose">{note.body}</div>
    </article>
  );
}
