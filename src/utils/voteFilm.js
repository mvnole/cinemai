// src/utils/voteFilm.js

import { supabase } from "../utils/supabaseClient";

// Upsert (like = 5, dislike = 1). Dacă vote === null, șterge votul.
export async function voteFilm(filmId, profileId, vote) {
  if (!filmId || !profileId) {
    console.warn("voteFilm: filmId sau profileId lipsă!");
    return;
  }

  if (vote === null) {
    // Șterge votul profilului pentru film
    const { error: deleteError } = await supabase
      .from("film_votes")
      .delete()
      .eq("film_id", filmId)
      .eq("profile_id", profileId);
    if (deleteError) {
      console.error("Eroare la DELETE vot:", deleteError.message);
    }
    return deleteError;
  }

  // Upsert cu conflict pe ["film_id", "profile_id"]
  const { error } = await supabase
    .from("film_votes")
    .upsert(
      [{ film_id: filmId, profile_id: profileId, vote }],
      { onConflict: ["film_id", "profile_id"] }
    );
  if (error) {
    console.error("Eroare la UPSERT vot:", error.message);
  }
  return error;
}

// Ia votul profilului pentru un film (returnează null dacă nu există vot)
export async function getProfileVote(filmId, profileId) {
  if (!filmId || !profileId) return null;
  const { data, error } = await supabase
    .from("film_votes")
    .select("vote")
    .eq("film_id", filmId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    console.error("Eroare la getProfileVote:", error.message);
    return null;
  }
  return data?.vote ?? null;
}

// Calculează media ratingurilor pentru un film (doar voturi 1 sau 5)
export async function getFilmAverageRating(filmId) {
  if (!filmId) return 0;
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
