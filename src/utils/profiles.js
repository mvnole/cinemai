import { supabase } from "../utils/supabaseClient";

export async function fetchProfiles(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, name, avatar_url, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addProfile(userId, { name, avatar_url }) {
  const { data, error } = await supabase
    .from("profiles")
    .insert({ user_id: userId, name, avatar_url })
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function editProfile(userId, profileId, { name, avatar_url }) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ name, avatar_url })
    .eq("id", profileId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteProfile(userId, profileId) {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId)
    .eq("user_id", userId);
  if (error) throw error;
}
