import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { currentSlot, pickFeatured } from "@/lib/hour";
export const dynamic = "force-dynamic";
export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const slot = currentSlot();
  const { data: existing } = await supabase.from("hours").select("*").eq("slot", slot).maybeSingle();
  const { data: notes } = await supabase.from("notes").select("id,title,body").eq("is_public", true).limit(80);
  const featured = pickFeatured(notes || [], slot);
  const headline = featured ? featured.title : "An empty hour";
  const editorial = featured ? (featured.body || "").slice(0, 280) : "No public pieces yet. The glass waits.";
  if (!existing) {
    await supabase.from("hours").insert({ slot, headline, editorial, featured_note_id: featured?.id || null });
  }
  return NextResponse.json({ slot, headline, featured_note_id: featured?.id || null });
}
