import { supabase } from "../utils/supabaseClient";

export async function updateUserProgress(userId, filmId, lastPosition) {
  const { error } = await supabase
    .from('user_progress')
    .upsert([
      {
        user_id: userId,     // nu „id”!
        film_id: filmId,
        last_position: lastPosition,
        updated_at: new Date().toISOString()
      }
    ], { onConflict: ['user_id', 'film_id'] }); // important!
  if (error) console.error("Error updating progress:", error);
}