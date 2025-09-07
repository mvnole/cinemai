import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { upsertAccount } from "../utils/upsertAccount";
import { fetchProfiles, addProfile, editProfile, deleteProfile } from "../utils/profiles";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsGdpr, setNeedsGdpr] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);

  // 1. Auth logic + session!
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session || null);
      setUser(data?.session?.user || null);
      setLoading(false);
      console.log("[UserContext] getSession ->", data?.session?.user || null);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sessionObj) => {
      setSession(sessionObj || null);
      setUser(sessionObj?.user || null);
      setLoading(false);
      console.log("[UserContext] onAuthStateChange ->", sessionObj?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2. Upsert accounts și fetch profiles la user change
  useEffect(() => {
    if (!user?.id) {
      setProfiles([]);
      setActiveProfile(null);
      console.log("[UserContext] User not found (pending or logout), clear state (not localStorage)");
      return;
    }
    (async () => {
      await upsertAccount(user);
      try {
        const fetchedProfiles = await fetchProfiles(user.id);
        setProfiles(fetchedProfiles);
        console.log("[UserContext] Profiles fetched ->", fetchedProfiles);
      } catch {
        setProfiles([]);
        console.log("[UserContext] Profiles fetch error, set []");
      }
    })();
  }, [user]);

  // 3. Sticky profile logic Netflix style
  useEffect(() => {
    if (!user?.id) {
      setProfiles([]);
      setActiveProfile(null);
      return;
    }
    (async () => {
      await upsertAccount(user);
      try {
        const fetchedProfiles = await fetchProfiles(user.id);
        setProfiles(fetchedProfiles);
      } catch {
        setProfiles([]);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user?.id && activeProfile) {
      setActiveProfile(null);
      setProfiles([]);
      localStorage.removeItem("activeProfileId");
      return;
    }
    if (!user?.id || profiles.length === 0) return;
    const savedProfileId = localStorage.getItem("activeProfileId");
    const found = profiles.find((p) => p.id === savedProfileId);
    if (savedProfileId && found) {
      if (!activeProfile || activeProfile.id !== savedProfileId) {
        setActiveProfile(found);
      }
      return;
    }
    if (profiles.length > 0) {
      setActiveProfile(profiles[0]);
      localStorage.setItem("activeProfileId", profiles[0].id);
    }
  }, [user, profiles]);

  const selectProfile = (profileId) => {
    const foundProfile = profiles.find((p) => p.id === profileId);
    if (foundProfile) {
      setActiveProfile(foundProfile);
      localStorage.setItem("activeProfileId", foundProfile.id);
    }
  };

  // 5. GDPR logic pe cont
  useEffect(() => {
    if (!user?.id) return;
    async function checkGdpr() {
      const { data: account } = await supabase
        .from("accounts")
        .select("accepted_privacy, accepted_terms")
        .eq("id", user.id)
        .maybeSingle();
      setNeedsGdpr(!account?.accepted_privacy || !account?.accepted_terms);
      console.log("[UserContext] GDPR checked:", account);
    }
    checkGdpr();
  }, [user]);

  const acceptGdpr = async () => {
    if (!user?.id) return;
    const now = new Date().toISOString();
    await supabase.from("accounts").update({
      accepted_privacy: true,
      accepted_privacy_at: now,
      accepted_terms: true,
      accepted_terms_at: now,
    }).eq("id", user.id);
    setNeedsGdpr(false);
    console.log("[UserContext] acceptGdpr called");
  };

  // 6. Profile management
  const handleAddProfile = async ({ name, avatar_url }) => {
    await addProfile(user.id, { name, avatar_url });
    const fetchedProfiles = await fetchProfiles(user.id);
    setProfiles(fetchedProfiles);
    console.log("[UserContext] handleAddProfile:", fetchedProfiles);
  };

  const handleEditProfile = async (profileId, { name, avatar_url }) => {
    await editProfile(user.id, profileId, { name, avatar_url });
    const fetchedProfiles = await fetchProfiles(user.id);
    setProfiles(fetchedProfiles);
    if (activeProfile?.id === profileId) {
      const updated = fetchedProfiles.find((pr) => pr.id === profileId);
      if (updated) {
        setActiveProfile(updated);
        localStorage.setItem("activeProfileId", updated.id);
        console.log("[UserContext] handleEditProfile, updated activeProfile", updated);
      }
    }
  };

  const handleDeleteProfile = async (profileId) => {
    await deleteProfile(user.id, profileId);
    const fetchedProfiles = await fetchProfiles(user.id);
    setProfiles(fetchedProfiles);
    if (activeProfile?.id === profileId) {
      setActiveProfile(null);
      localStorage.removeItem("activeProfileId");
      console.log("[UserContext] handleDeleteProfile, deleted activeProfile", profileId);
    }
  };

  // 7. Auth logic cu login după username/email
  const login = async (emailOrUsername, password) => {
    let email = emailOrUsername;
    if (!/\S+@\S+\.\S+/.test(emailOrUsername)) {
      const { data, error } = await supabase
        .from("accounts")
        .select("email")
        .eq("username", emailOrUsername)
        .maybeSingle();
      if (error || !data?.email) {
        throw new Error("Username not found");
      }
      email = data.email;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log("[UserContext] login called for", email);
  };

  const register = async (email, password, metadata = {}) => {
    const isLocalhost = window.location.hostname === "localhost";
    const redirectTo = isLocalhost
      ? "http://localhost:3000/subscription"
      : "https://cinemai.live/subscription";
    const now = new Date().toISOString();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          accepted_privacy: true,
          accepted_privacy_at: now,
          accepted_terms: true,
          accepted_terms_at: now,
        },
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw error;
    console.log("[UserContext] register called for", email);
  };

  // 8. Logout explicit (aici chiar ștergi tot, ca la Netflix)
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfiles([]);
    setActiveProfile(null);
    localStorage.removeItem("activeProfileId");
    localStorage.removeItem("cinemai_cookie_preferences"); // Șterge și preferințele la logout (opțional)
    console.log("[UserContext] logout: user, profiles, activeProfile cleared");
  };

  // 9. SAVE COOKIE PREFERENCES IN SUPABASE
  const saveCookiePreferencesToAccount = async (preferences) => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("accounts")
      .update({
        cookie_preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    if (error) {
      console.error("[UserContext] Eroare la salvarea cookie_preferences:", error);
    } else {
      console.log("[UserContext] cookie_preferences updated in Supabase:", preferences);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        session,
        loading,
        login,
        register,
        logout,
        needsGdpr,
        acceptGdpr,
        profiles,
        addProfile: handleAddProfile,
        editProfile: handleEditProfile,
        deleteProfile: handleDeleteProfile,
        activeProfile,
        selectProfile,
        saveCookiePreferencesToAccount, // <-- AICI!
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
