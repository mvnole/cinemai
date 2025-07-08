import { supabase } from "../utils/supabaseClient";

// Votează (like = 5, dislike = 1). Dacă vote === null, șterge votul!
export async function voteFilm(filmId, userId, vote) {
  if (vote === null) {
    // Șterge votul userului pentru film
    const { error: deleteError } = await supabase
      .from("film_votes")
      .delete()
      .eq("film_id", filmId)
      .eq("user_id", userId);
    if (deleteError) {
      console.error("Eroare la DELETE vot:", deleteError);
    }
    return deleteError;
  }

  // Upsert cu conflict pe ["film_id", "user_id"]
  const { error } = await supabase
    .from("film_votes")
    .upsert(
      [{ film_id: filmId, user_id: userId, vote }],
      { onConflict: ['film_id', 'user_id'] }
    );
  if (error) {
    console.error("Eroare la UPSERT vot:", error);
  }
  return error;
}

// Ia votul userului pentru un film (returnează null dacă nu există vot)
export async function getUserVote(filmId, userId) {
  const { data, error } = await supabase
    .from("film_votes")
    .select("vote")
    .eq("film_id", filmId)
    .eq("user_id", userId)
    .maybeSingle(); // <<< AICI E SECRETUL!

  if (error) {
    console.error("Eroare la getUserVote:", error);
    return null;
  }
  return data?.vote ?? null;
}

// Calculează media ratingurilor pentru un film (doar voturi 1 sau 5)
export async function getFilmAverageRating(filmId) {
  const { data, error } = await supabase
    .from("film_votes")
    .select("vote")
    .eq("film_id", filmId);

  if (error || !data || !data.length) return 0;

  // Numai voturile valide 1 sau 5 (like/dislike)
  const validVotes = data.filter(d => d.vote === 1 || d.vote === 5);
  if (validVotes.length === 0) return 0;

  const avg = validVotes.reduce((acc, curr) => acc + curr.vote, 0) / validVotes.length;
  return Math.round(avg * 10) / 10;
}
