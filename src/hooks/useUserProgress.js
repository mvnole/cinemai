import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

/**
 * Custom hook pentru a obține lista cu toate filmele și poziția la care a rămas userul (pe un profil)
 */
export function useUserProgress(profileId) {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      setProgressList([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    supabase
      .from("user_progress")
      .select("film_id, last_position")
      .eq("profile_id", profileId)
      .gt("last_position", 0)
      .then(({ data, error }) => {
        if (error) {
          console.error("Eroare la fetch user_progress:", error.message);
          setProgressList([]);
        } else {
          setProgressList(data || []);
        }
        setLoading(false);
      });
  }, [profileId]);

  return { progressList, loading };
}

/**
 * Functie helper pentru a salva (upsert) progresul unui film
 * Scrie ultima poziție vizionată pentru un profil și film dat.
 */
export async function updateUserProgress(profileId, filmId, lastPosition) {
  if (!profileId || !filmId) return;
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      [{ profile_id: profileId, film_id: filmId, last_position: lastPosition }],
      { onConflict: ['profile_id', 'film_id'] }
    );
  if (error) {
    console.error("Eroare la salvarea progresului:", error.message);
  }
  return data;
}

/**
 * (Optional) Returnează progresul la un anumit film pentru un profil
 */
export async function getFilmProgress(profileId, filmId) {
  if (!profileId || !filmId) return null;
  const { data, error } = await supabase
    .from("user_progress")
    .select("last_position")
    .eq("profile_id", profileId)
    .eq("film_id", filmId)
    .maybeSingle();
  if (error) {
    console.error("Eroare la fetch progres film:", error.message);
    return null;
  }
  return data?.last_position || 0;
}
