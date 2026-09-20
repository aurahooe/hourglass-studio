import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import StudioDesk from "./desk";
export default async function StudioPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, { data: notes }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("notes").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
  ]);
  return <StudioDesk profile={profile} notes={notes || []} />;
}
