// utils/upsertProfile.js
import { supabase } from "../utils/supabaseClient";

export async function upsertProfile(user) {
  if (!user?.id) return;
  // Poți adăuga și alte câmpuri de user aici dacă le ai (ex: username)
  const { id, email } = user;

  // upsert by id (care e UUID-ul userului, generat de supabase.auth)
  const { error } = await supabase
    .from("profiles")
    .upsert([{ id, email }], { onConflict: ['id'] }); // important să specifici conflictul pe "id"!

  if (error) {
    console.error("Eroare la upsertProfile:", error);
  }
}
