import { supabase } from "../utils/supabaseClient";

/**
 * Upsert progres pentru un anumit profil la un film.
 * @param {string} profileId - id-ul profilului (nu user principal)
 * @param {string} filmId - id-ul filmului
 * @param {number} lastPosition - poziția curentă (secunde, milisecunde etc)
 */
export async function updateProfileProgress(profileId, filmId, lastPosition) {
  const { error } = await supabase
    .from('user_progress')
    .upsert([
      {
        profile_id: profileId,
        film_id: filmId,
        last_position: lastPosition,
        updated_at: new Date().toISOString()
      }
    ], { onConflict: ['profile_id', 'film_id'] }); // important!
  if (error) console.error("Error updating progress:", error);
}

/**
 * Fetch progresul unui profil pentru un film anume.
 * @param {string} profileId - id-ul profilului
 * @param {string} filmId - id-ul filmului
 * @returns {number} poziția curentă (sau 0 dacă nu există progres)
 */
export async function getProfileProgress(profileId, filmId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('last_position')
    .eq('profile_id', profileId)
    .eq('film_id', filmId)
    .single();

  if (error) return 0; // sau tratezi diferit dacă vrei să afișezi eroare
  return data?.last_position || 0;
}

/**
 * (Bonus) Fetch toate filmele cu progres pentru un profil
 * @param {string} profileId - id-ul profilului
 * @returns {Array} listă cu toate progresurile filmelor pentru acel profil
 */
export async function getAllProfileProgress(profileId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('film_id, last_position, updated_at')
    .eq('profile_id', profileId);

  if (error) return [];
  return data || [];
}
