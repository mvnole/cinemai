import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { upsertAccount } from "../utils/upsertAccount";
import { fetchProfiles, addProfile, editProfile, deleteProfile } from "../utils/profiles";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsGdpr, setNeedsGdpr] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);

  // 1. Auth logic
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
      console.log("[UserContext] getUser ->", data?.user || null);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      console.log("[UserContext] onAuthStateChange ->", session?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2. Upsert accounts și fetch profiles la user change
  useEffect(() => {
    if (!user?.id) {
      // ATENȚIE: aici NU ștergem nimic din localStorage. Ștergem doar la logout explicit!
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
    console.log("[UserContext] --- EFFECT TRIGGERED ---");
    console.log("[UserContext] user?.id:", user?.id);
    console.log("[UserContext] profiles:", profiles);
    console.log("[UserContext] localStorage activeProfileId:", localStorage.getItem("activeProfileId"));

    // 1. Doar la logout explicit curățăm complet!
    if (!user?.id && activeProfile) {
      setActiveProfile(null);
      setProfiles([]);
      localStorage.removeItem("activeProfileId");
      console.log("[UserContext] LOGOUT DETECTED, clear all and localStorage");
      return;
    }

    // 2. Cât timp profilele nu sunt încărcate, nu modificăm nimic.
    if (!user?.id || profiles.length === 0) {
      return;
    }

    // 3. Dacă există profileId în localStorage și profil valid, îl folosim.
    const savedProfileId = localStorage.getItem("activeProfileId");
    const found = profiles.find((p) => p.id === savedProfileId);

    if (savedProfileId && found) {
      if (!activeProfile || activeProfile.id !== savedProfileId) {
        setActiveProfile(found);
        console.log("[UserContext] Set activeProfile from localStorage:", found);
      } else {
        console.log("[UserContext] activeProfile already set:", activeProfile);
      }
      return;
    }

    // 4. Dacă nu există profil salvat sau nu se potrivește, selectează primul profil și salvează-l sticky!
    if (profiles.length > 0) {
      setActiveProfile(profiles[0]);
      localStorage.setItem("activeProfileId", profiles[0].id);
      console.log("[UserContext] Set activeProfile as first profile and saved to localStorage:", profiles[0]);
    }
  }, [user, profiles]); // Nu include activeProfile aici!

  // 4. Select profile manual
  const selectProfile = (profileId) => {
    const foundProfile = profiles.find((p) => p.id === profileId);
    if (foundProfile) {
      setActiveProfile(foundProfile);
      localStorage.setItem("activeProfileId", foundProfile.id);
      console.log("[UserContext] selectProfile: saved", foundProfile.id, "in localStorage");
    } else {
      console.log("[UserContext] selectProfile: profile not found", profileId);
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
    console.log("[UserContext] logout: user, profiles, activeProfile cleared");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
