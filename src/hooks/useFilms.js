// useFilms.js
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useFilms(query = "") {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      let supaQuery = supabase
        .from("films")
        .select("*")
        .order("created_at", { ascending: false });

      if (query) {
        supaQuery = supaQuery.ilike("title", `%${query}%`);
      }

      const { data, error } = await supaQuery;
      setFilms(data || []);
      setLoading(false);
    }
    fetchFilms();
  }, [query]);

  return { films, loading };
}
