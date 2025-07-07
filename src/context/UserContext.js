// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsGdpr, setNeedsGdpr] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // GDPR verificare după autentificare sau schimbare user
  useEffect(() => {
    if (!user?.id) return;
    async function checkGdpr() {
      // Caută în profiles dacă are acceptat privacy/terms
      const { data: profile } = await supabase
        .from("profiles")
        .select("accepted_privacy, accepted_terms")
        .eq("id", user.id)
        .single();

      if (!profile?.accepted_privacy || !profile?.accepted_terms) {
        setNeedsGdpr(true);
      } else {
        setNeedsGdpr(false);
      }
    }
    checkGdpr();
  }, [user]);

  // Funcție pentru accept GDPR (privacy + terms)
  const acceptGdpr = async () => {
    if (!user?.id) return;
    const now = new Date().toISOString();
    await supabase.from("profiles").update({
      accepted_privacy: true,
      accepted_privacy_at: now,
      accepted_terms: true,
      accepted_terms_at: now,
    }).eq("id", user.id);
    setNeedsGdpr(false);
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // MODIFICARE: trimite accepted_privacy, accepted_terms și timestamp la register
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
        emailRedirectTo: redirectTo
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setLoading,
        login,
        register,
        logout,
        needsGdpr,
        acceptGdpr,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
