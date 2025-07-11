// src/hooks/useFavorite.js
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

// HOOK pentru UN singur film (FilmCard)
export function useFavorite(filmId, userId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    if (!filmId || !userId) return;
    let active = true;

    async function checkFavorite() {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("film_id", filmId)
        .eq("", userId)
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
  }, [filmId, userId]);

  const addFavorite = async () => {
    const { data } = await supabase
      .from("favorites")
      .insert([{ film_id: filmId, user_id: userId }])
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

// HOOK global pentru TOATE favoritele userului (Homepage, My List etc)
export function useUserFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    supabase
      .from("favorites")
      .select("film_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        setFavorites(data ? data.map(row => row.film_id) : []);
        setLoading(false);
      });
  }, [userId]);

  return { favorites, loading };
}
