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
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
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
      localStorage.removeItem("activeProfileId");
      return;
    }
    (async () => {
      await upsertAccount(user);
      try {
        const profiles = await fetchProfiles(user.id);
        setProfiles(profiles);
      } catch {
        setProfiles([]);
      }
    })();
  }, [user]);

  // 3. Sticky profile logic - NU suprascrie manualul, doar la prima încărcare!
  useEffect(() => {
  // Log pentru fiecare execuție!
  console.log("[UserContext] --- EFFECT TRIGGERED ---");
  console.log("[UserContext] user?.id:", user?.id);
  console.log("[UserContext] profiles:", profiles);

  if (!user?.id || profiles.length === 0) {
    setActiveProfile(null);
    console.log("[UserContext] NO USER or EMPTY profiles => setActiveProfile(null)");
    return;
  }

  const savedProfileId = localStorage.getItem("activeProfileId");
  console.log("[UserContext] savedProfileId from localStorage:", savedProfileId);

  // 1. Dacă există profil salvat, încearcă să-l folosești!
  if (savedProfileId) {
    const found = profiles.find((p) => p.id === savedProfileId);
    if (found) {
      setActiveProfile(found);
      console.log("[UserContext] Found savedProfileId in profiles, setActiveProfile:", found.id);
      return;
    } else {
      console.log("[UserContext] savedProfileId NU E în profiles (poate a fost șters)");
    }
  }

  // 2. Dacă nu există profil salvat sau nu mai e valid, setează fallback la primul.
  setActiveProfile(profiles[0]);
  localStorage.setItem("activeProfileId", profiles[0].id);
  console.log("[UserContext] Fallback: setActiveProfile(profiles[0]) și salvez în localStorage:", profiles[0].id);

}, [user, profiles]);


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
  };

  // 6. Profile management
  const handleAddProfile = async ({ name, avatar_url }) => {
    await addProfile(user.id, { name, avatar_url });
    const profiles = await fetchProfiles(user.id);
    setProfiles(profiles);
  };

  const handleEditProfile = async (profileId, { name, avatar_url }) => {
    await editProfile(user.id, profileId, { name, avatar_url });
    const profiles = await fetchProfiles(user.id);
    setProfiles(profiles);
    if (activeProfile?.id === profileId) {
      const updated = profiles.find((pr) => pr.id === profileId);
      if (updated) {
        setActiveProfile(updated);
        localStorage.setItem("activeProfileId", updated.id);
      }
    }
  };

  const handleDeleteProfile = async (profileId) => {
    await deleteProfile(user.id, profileId);
    const profiles = await fetchProfiles(user.id);
    setProfiles(profiles);
    if (activeProfile?.id === profileId) {
      setActiveProfile(null);
      localStorage.removeItem("activeProfileId");
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
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfiles([]);
    setActiveProfile(null);
    localStorage.removeItem("activeProfileId");
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
