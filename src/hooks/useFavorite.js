// src/hooks/useFavorite.js
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export function useFavorite(filmId, userId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    if (!filmId || !userId) return;
    console.log("user_id=", userId, "film_id=", filmId);
    async function checkFavorite() {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("film_id", filmId)
        .eq("user_id", userId)
        .maybeSingle();
      if (data) {
        setIsFavorite(true);
        setFavoriteId(data.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    }
    checkFavorite();
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
