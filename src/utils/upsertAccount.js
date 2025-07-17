import { supabase } from "../utils/supabaseClient";

export async function upsertAccount(user) {
  if (!user?.id) return;
  const now = new Date().toISOString();

  // DEBUG: vezi ce ajunge in user_metadata!
  console.log("[upsertAccount] user_metadata:", user.user_metadata);

  const email      = user.email ?? null;
  const username   = user.user_metadata?.username ?? null;
  const full_name  = user.user_metadata?.full_name ?? null;
  const gender     = user.user_metadata?.gender ?? null;
  const birth_date = user.user_metadata?.birth_date ?? null;
  const accepted_privacy = user.user_metadata?.accepted_privacy ?? false;
  const accepted_terms   = user.user_metadata?.accepted_terms ?? false;
  const accepted_privacy_at = user.user_metadata?.accepted_privacy_at ?? null;
  const accepted_terms_at   = user.user_metadata?.accepted_terms_at ?? null;

  const { error } = await supabase
    .from("accounts")
    .upsert([{
      id: user.id,
      email,
      username,
      full_name,
      gender,
      birth_date,
      accepted_privacy,
      accepted_privacy_at,
      accepted_terms,
      accepted_terms_at,
      updated_at: now,
    }], { onConflict: "id" });

  if (error) {
    console.error("[upsertAccount] ERROR:", error.message);
  } else {
    console.log("[upsertAccount] SUCCESS", email);
  }
}
