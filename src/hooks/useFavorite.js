import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

// HOOK pentru UN singur film (FilmCard)
export function useFavorite(filmId, profileId) { // profileId, nu userId!
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    if (!filmId || !profileId) return;
    let active = true;

    async function checkFavorite() {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("film_id", filmId)
        .eq("user_id", profileId) // <-- corect
        .maybeSingle();
      if (!active) return;
      if (data) {
        setIsFavorite(true);
        setFavoriteId(data.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    }
    checkFavorite();
    return () => { active = false };
  }, [filmId, profileId]);

  const addFavorite = async () => {
    const { data } = await supabase
      .from("favorites")
      .insert([{ film_id: filmId, user_id: profileId }]) // <-- corect
      .select("id")
      .maybeSingle();
    if (data) {
      setIsFavorite(true);
      setFavoriteId(data.id);
    }
  };

  const removeFavorite = async () => {
    if (!favoriteId) return;
    await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId);
    setIsFavorite(false);
    setFavoriteId(null);
  };

  return { isFavorite, addFavorite, removeFavorite };
}

// HOOK global pentru TOATE favoritele profilului activ (Homepage, My List etc)
export function useUserFavorites(profileId) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileId) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    supabase
      .from("favorites")
      .select("film_id")
      .eq("user_id", profileId)
      .then(({ data }) => {
        setFavorites(data ? data.map(row => row.film_id) : []);
        setLoading(false);
      });
  }, [profileId]);

  return { favorites, loading };
}
