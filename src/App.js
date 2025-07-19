import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "video-react/dist/video-react.css";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import ManageProfilesPage from "./pages/ManageProfilesPage";
import SearchPage from "./pages/SearchPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import WatchPage from "./pages/WatchPage";
import { SettingsPage } from "./components/SettingsPage";
import UserPage from "./pages/UserPage";
import { FilmPageModal } from "./components/FilmPageModal";
import OutsideClickWrapper from "./components/OutsideClickWrapper";
import FilmsPage from "./pages/FilmsPage";
import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";
import { useUser } from "./context/UserContext";
import LoginPage from "./pages/LoginPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import { supabase } from "./utils/supabaseClient";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Banner cookies (cu update pentru userii vechi logați)
export function CookieConsentBanner() {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);

  // Scoatem funcția ca să poată fi apelată și în handleAccept!
  const checkConsent = async () => {
    if (user?.id) {
      const { data: account, error } = await supabase
        .from("accounts")
        .select("username, accepted_privacy, accepted_terms")
        .eq("id", user.id)
        .maybeSingle();
      if (!account?.accepted_privacy || !account?.accepted_terms) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } else {
      const localConsent = localStorage.getItem("cinemai_cookie_consent");
      setVisible(!localConsent || localConsent === "pending");
    }
  };

  useEffect(() => {
    checkConsent();
  }, [user]);

  const handleAccept = async () => {
    localStorage.setItem("cinemai_cookie_consent", "accepted");
    if (user?.id) {
      const now = new Date().toISOString();
      const { error } = await supabase.from("accounts").update({
        accepted_privacy: true,
        accepted_privacy_at: now,
        accepted_terms: true,
        accepted_terms_at: now,
      }).eq("id", user.id);

      if (error) {
        console.error("[CookieBanner] Supabase UPDATE error:", error);
        alert("Supabase error: " + error.message);
        return;
      }
      await checkConsent(); // Refă fetch-ul, astfel încât bannerul să dispară la refresh!
    }
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cinemai_cookie_consent", "declined");
    setVisible(false);
  };

  // Bonus: poți adăuga și localStorage check ca fallback extra safe
  if (!visible || localStorage.getItem("cinemai_cookie_consent") === "accepted") return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[99999] bg-black/90 backdrop-blur-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 shadow-xl">
      <span className="text-sm sm:text-base text-gray-200">
        This site uses cookies to improve your experience.{" "}
        <a href="/privacy" className="underline text-cyan-400 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
        .
      </span>
      <div className="flex gap-2">
        <button
          onClick={handleDecline}
          className="bg-zinc-700 hover:bg-zinc-600 text-gray-200 px-6 py-2 rounded-lg font-semibold text-sm transition"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showUsers, setShowUsers] = useState(false);
  const mobileUserRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const { loading, user } = useUser();

  // ---------------- Draperii cinema ------------------
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [showCurtains, setShowCurtains] = useState(false);

  useEffect(() => {
    if (location.pathname === "/" && state?.fromManageProfiles) {
      setShowCurtains(true);
      setCurtainsOpen(false);
      setTimeout(() => setCurtainsOpen(true), 80);
      setTimeout(() => setShowCurtains(false), 900);
      navigate("/", { replace: true, state: {} });
    }
  }, [location.pathname, state]);
  // ----------------------------------------------------

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileUserRef.current &&
        !mobileUserRef.current.contains(event.target)
      ) {
        setShowUsers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      !loading &&
      user?.confirmed_at &&
      location.pathname === "/" &&
      !user?.user_metadata?.plan
    ) {
      navigate("/subscription");
    }
  }, [loading, user, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white relative overflow-x-hidden">
      <Header
        showUsers={showUsers}
        setShowUsers={setShowUsers}
        userMenuRef={mobileUserRef}
      />

      {showCurtains && (
        <>
          <motion.div
            initial={{ left: 0 }}
            animate={curtainsOpen ? { left: "-51%" } : { left: 0 }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
            className="fixed top-0 left-0 w-1/2 h-screen bg-gradient-to-br from-[#0d2230] via-[#08243c] to-[#0a1a25] z-[9999] pointer-events-none"
            style={{ borderRight: "3px solid #00bcd4", boxShadow: "6px 0 24px 0 #0af6" }}
          />
          <motion.div
            initial={{ right: 0 }}
            animate={curtainsOpen ? { right: "-51%" } : { right: 0 }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
            className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-[#0d2230] via-[#08243c] to-[#0a1a25] z-[9999] pointer-events-none"
            style={{ borderLeft: "3px solid #00bcd4", boxShadow: "-6px 0 24px 0 #0af6" }}
          />
        </>
      )}

      <div className="pt-16" />

      <CookieConsentBanner />

      <div className="pointer-events-none fixed z-0 inset-0">
        <div className="absolute w-96 h-96 bg-cyan-400 opacity-20 blur-3xl rounded-full left-[-6rem] top-[-4rem]"></div>
        <div className="absolute w-72 h-72 bg-violet-500 opacity-10 blur-2xl rounded-full right-[-3rem] top-[60%]"></div>
      </div>

      <main className="p-6 space-y-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={state?.modal ? state.backgroundLocation?.pathname : location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={state?.modal ? state.backgroundLocation || location : location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/manage-profiles" element={<ManageProfilesPage />} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/tv-shows" element={<h2 className="text-xl">TV Shows Page (în lucru)</h2>} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/films" element={<FilmsPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/edit-profile/:id" element={<EditProfilePage />} />
              {/* Doar UNA dintre rutele /edit-profile (păstrează doar cu id dacă folosești id) */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/user/:id" element={<UserPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              {/* Film page modal pe route direct */}
              {!state?.modal && (
                <Route
                  path="/film/:id"
                  element={
                    <OutsideClickWrapper redirectTo={location.state?.fromSearch ? "/search" : "/"}>
                      <FilmPageModal />
                    </OutsideClickWrapper>
                  }
                />
              )}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal film (peste tot, DOAR ca modal) */}
      <AnimatePresence>
        {state?.modal && (
          <Routes>
            <Route path="/film/:id" element={<FilmPageModal />} />
            <Route path="/watch/:id" element={<WatchPage />} />
          </Routes>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
