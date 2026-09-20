import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { currentSlot, hourLabel, pickFeatured } from "@/lib/hour";
import HourTick from "./hour-tick";
export const revalidate = 60;
export default async function Home() {
  const supabase = createClient();
  const slot = currentSlot();
  const { data: notes } = await supabase
    .from("notes")
    .select("id,title,body,created_at,user_id,profiles(handle,display_name)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(48);
  const list = notes || [];
  const featured = pickFeatured(list, slot);
  return (
    <>
      <section className="hero">
        <div>
          <h1>Things kept<br />for an hour.</h1>
          <p className="lede">Write something. Mark it public and it joins the wall. Every hour the room chooses one piece and sets it in the window.</p>
        </div>
        <aside className="hour-card">
          <p className="kicker">This hour</p>
          {featured ? (
            <>
              <h2><Link href={`/n/${featured.id}`}>{featured.title}</Link></h2>
              <p>{(featured.body || "").slice(0, 160)}{(featured.body || "").length > 160 ? "…" : ""}</p>
            </>
          ) : (
            <><h2>The window is empty</h2><p>Be the first to leave a public piece in the studio.</p></>
          )}
          <HourTick label={hourLabel()} />
        </aside>
      </section>
      <div className="grid">
        {list.map((n) => (
          <Link key={n.id} href={`/n/${n.id}`} className="piece">
            <h3>{n.title}</h3>
            <p className="excerpt">{n.body}</p>
            <div className="meta">
              <span>{n.profiles?.display_name || n.profiles?.handle || "anon"}</span>
              <span>{new Date(n.created_at).toLocaleDateString("en-GB")}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
