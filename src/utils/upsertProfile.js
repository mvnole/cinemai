import { supabase } from "../utils/supabaseClient";

/**
 * Creează sau actualizează un profil de vizionare pentru userul dat.
 * @param {Object} profile - datele profilului (obligatoriu: user_id, name)
 * @param {string} [profile.id] - id profil (pentru update)
 * @param {string} profile.user_id - user-ul de care aparține profilul (obligatoriu)
 * @param {string} profile.name - numele profilului (obligatoriu)
 * @param {string} [profile.avatar_url] - avatar url (optional)
 * @param {boolean} [profile.accepted_privacy] - GDPR privacy (optional)
 * @param {string} [profile.accepted_privacy_at] - (optional)
 * @param {boolean} [profile.accepted_terms] - GDPR terms (optional)
 * @param {string} [profile.accepted_terms_at] - (optional)
 * @returns {Promise<Object>} profilul updatat/creat
 */
export async function upsertProfile(profile) {
  if (!profile?.user_id || !profile?.name) {
    throw new Error("user_id și name sunt obligatorii pentru profil!");
  }
  const now = new Date().toISOString();
  // Dacă nu are id => creezi profil nou, altfel îl updatezi (după id)
  const dataToInsert = {
    user_id: profile.user_id,
    name: profile.name,
    avatar_url: profile.avatar_url ?? null,
    accepted_privacy: profile.accepted_privacy ?? false,
    accepted_privacy_at: profile.accepted_privacy_at ?? null,
    accepted_terms: profile.accepted_terms ?? false,
    accepted_terms_at: profile.accepted_terms_at ?? null,
    created_at: profile.created_at ?? now,
  };
  // Dacă faci update, pune și id
  if (profile.id) dataToInsert.id = profile.id;

  const { data, error } = await supabase
    .from("profiles")
    .upsert([dataToInsert], { onConflict: "id" }) // update după id dacă există!
    .select()
    .maybeSingle();

  if (error) {
    console.error("[upsertProfile] ERROR:", error.message);
    throw error;
  }

  // Returnează profilul creat/actualizat
  return data;
}
