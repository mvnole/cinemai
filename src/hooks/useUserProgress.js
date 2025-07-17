import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

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
      .eq("profile_id", profileId) // <-- AICI E CORECT!
      .gt("last_position", 0)
      .then(({ data }) => {
        setProgressList(data || []);
        setLoading(false);
      });
  }, [profileId]);

  return { progressList, loading };
}
