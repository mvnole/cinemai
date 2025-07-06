import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "video-react/dist/video-react.css";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import ManageProfilesPage from "./pages/ManageProfilesPage";
import SearchPage from "./pages/SearchPage";
import { FilmPage } from "./pages/FilmPage";
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
import { useFilms } from "./hooks/useFilms";

function App() {
  const [showUsers, setShowUsers] = useState(false);
  const mobileUserRef = useRef();
  const desktopUserRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const { loading, user, setLoading } = useUser();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (mobileUserRef.current && !mobileUserRef.current.contains(event.target)) &&
        (desktopUserRef.current && !desktopUserRef.current.contains(event.target))
      ) {
        setShowUsers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔁 Fallback: dacă userul e confirmat și fără plan, îl trimitem spre /subscription
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

      {/* Fundal bokeh/gradient - identic cu cel din SearchPage */}
      <div className="pointer-events-none fixed z-0 inset-0">
        <div className="absolute w-96 h-96 bg-cyan-400 opacity-20 blur-3xl rounded-full left-[-6rem] top-[-4rem]"></div>
        <div className="absolute w-72 h-72 bg-violet-500 opacity-10 blur-2xl rounded-full right-[-3rem] top-[60%]"></div>
      </div>

      <main className="p-6 space-y-10 relative z-10">
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
              <Route path="/movies" element={<h2 className="text-xl">Movies Page (în lucru)</h2>} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/tv-shows" element={<h2 className="text-xl">TV Shows Page (în lucru)</h2>} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/films" element={<FilmsPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {!state?.modal && (
                <Route
                  path="/film/:id"
                  element={
                    <OutsideClickWrapper redirectTo={location.state?.fromSearch ? "/search" : "/"}>
                      <FilmPage />
                    </OutsideClickWrapper>
                  }
                />
              )}
              {/* 🔥 SettingsPage ca pagină, nu ca modal */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/user/:id" element={<UserPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
            </Routes>

            {/* MODAL film */}
            {state?.modal && (
              <Routes>
                <Route path="/film/:id" element={<FilmPageModal />} />
              </Routes>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
