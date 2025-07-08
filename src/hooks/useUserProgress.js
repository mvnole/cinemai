import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useUserProgress(userId) {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProgressList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("user_progress")
      .select("film_id, last_position")
      .eq("user_id", userId)
      .gt("last_position", 0)
      .then(({ data }) => {
        setProgressList(data || []);
        setLoading(false);
      });
  }, [userId]);

  return { progressList, loading };
}
