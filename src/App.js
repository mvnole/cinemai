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
import SettingsPage from "./components/SettingsPage";
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
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CookiesPage from "./pages/CookiesPage";
import CinemaCurtains from "./components/CinemaCurtains";

// Bannerul și modalul de cookie, plus funcția unică de salvare:
import { CookieConsentBanner, CookiePreferencesModal, saveCookiePrefs } from "./components/CookieConsent";

function App() {
  const [showUsers, setShowUsers] = useState(false);
  const mobileUserRef = useRef();
  const [cookiePrefsOpen, setCookiePrefsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const { loading, user, saveCookiePreferencesToAccount } = useUser();

  // Draperii cinema
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
  }, [location.pathname, state, navigate]);

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

  // Handler global pentru deschiderea modului de cookies
  useEffect(() => {
    const openPrefs = () => setCookiePrefsOpen(true);
    window.addEventListener("cookie-preference-change", openPrefs);
    return () => window.removeEventListener("cookie-preference-change", openPrefs);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Handler pentru salvarea preferințelor (local+cookie+supabase)
  const handleSaveCookiePrefs = (prefs) => {
    // Dacă user e logat -> salvezi și în Supabase, altfel doar browser.
    saveCookiePrefs(prefs, user ? saveCookiePreferencesToAccount : undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white relative overflow-x-hidden">
      <Header
        showUsers={showUsers}
        setShowUsers={setShowUsers}
        userMenuRef={mobileUserRef}
      />

      {showCurtains && <CinemaCurtains active={curtainsOpen} />}

      <div className="pt-16" />

      {/* Banner și MODAL GDPR, ambele primesc funcția centralizată de salvare */}
      <CookieConsentBanner
        onPreferencesOpen={() => setCookiePrefsOpen(true)}
        saveToSupabase={user ? saveCookiePreferencesToAccount : undefined}
        saveCookiePrefs={handleSaveCookiePrefs}
      />
      <CookiePreferencesModal
        open={cookiePrefsOpen}
        onClose={() => setCookiePrefsOpen(false)}
        saveToSupabase={user ? saveCookiePreferencesToAccount : undefined}
        saveCookiePrefs={handleSaveCookiePrefs}
      />

      {/* Fundal blur cinematic */}
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
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/edit-profile/:id" element={<EditProfilePage />} />
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
