// App.js
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Home, Film, Tv, User, Settings, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "video-react/dist/video-react.css";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import { FilmPage } from "./pages/FilmPage";
import { SettingsPage } from "./components/SettingsPage";
import OutsideClickWrapper from "./components/OutsideClickWrapper";
import UserPage from "./pages/UserPage";
import { FilmPageModal } from "./components/FilmPageModal";
import Section from "./components/Section";

function App() {
  const [showUsers, setShowUsers] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileUserRef = useRef();
  const desktopUserRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

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

  useEffect(() => {
    const handleClickOutsideSettings = (e) => {
      const settingsWrapper = document.querySelector(".settings-wrapper");
      if (location.pathname === "/settings" && settingsWrapper && !settingsWrapper.contains(e.target)) {
        navigate("/");
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSettings);
    return () => document.removeEventListener("mousedown", handleClickOutsideSettings);
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white">
      <header className="w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-1 sm:px-4 sm:py-4 flex items-center justify-between flex-wrap gap-4 sm:flex-nowrap">
        {/* Mobile header row */}
        <div className="w-full flex justify-between items-center sm:hidden pt-2 pb-2">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white p-1">
            <Menu size={24} />
          </button>
          <Link to="/" className="text-3xl font-bold text-white hover:text-cyan-400 transition-colors leading-none">
            Cinem<span className="text-cyan-400">AI</span>
          </Link>
          <div className="flex gap-4 items-center relative" ref={mobileUserRef}>
            <button
              onClick={() => setShowUsers((prev) => !prev)}
              className="hover:scale-110 transition-transform text-white p-1"
            >
              <User size={24} />
            </button>
            <AnimatePresence>
              {showUsers && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ originY: 0 }}
                  className="absolute right-0 top-full mt-2 z-50 bg-zinc-800 text-white rounded shadow-lg w-48 p-4"
                >
                  <h3 className="font-semibold mb-2">Users</h3>
                  <ul className="space-y-2">
                    <li><Link to="/user/1" onClick={() => setShowUsers(false)} className="hover:text-cyan-400 block">User 1</Link></li>
                    <li><Link to="/user/2" onClick={() => setShowUsers(false)} className="hover:text-cyan-400 block">User 2</Link></li>
                    <li><Link to="/user/3" onClick={() => setShowUsers(false)} className="hover:text-cyan-400 block">User 3</Link></li>
                  </ul>
                  <hr className="my-2 border-zinc-600" />
                  <button
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 text-sm text-white hover:text-blue-400 px-2 py-1"
                  >
                    <Settings size={16} /> Setări
                  </button>
                  <button
                    onClick={() => {
                      setShowUsers(false);
                      navigate("/login");
                    }}
                    className="text-sm hover:text-red-400"
                  >
                    Delogare
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
{/* MENIU BURGER MOBILE DRAWER */}
<AnimatePresence>
  {showMobileMenu && (
    <>
      {/* Overlay negru */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowMobileMenu(false)}
      />
      {/* Drawer */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-full z-50 bg-zinc-900 border-r border-zinc-800 flex flex-col py-8 px-6 gap-4 shadow-2xl"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.22 }}
      >
        <button
          onClick={() => setShowMobileMenu(false)}
          className="self-end mb-8 text-gray-400 hover:text-white text-2xl"
          aria-label="Close menu"
        >
          ✕
        </button>
        <Link to="/" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-400" onClick={() => setShowMobileMenu(false)}>
          <Home size={20} /> Home
        </Link>
        <Link to="/movies" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-400" onClick={() => setShowMobileMenu(false)}>
          <Film size={20} /> Movies
        </Link>
        <Link to="/tv-shows" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-400" onClick={() => setShowMobileMenu(false)}>
          <Tv size={20} /> Series
        </Link>
        <Link to="/search" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-400" onClick={() => setShowMobileMenu(false)}>
          <Search size={20} /> Search
        </Link>
      </motion.div>
    </>
  )}
</AnimatePresence>
        {/* Desktop navigation + user */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <Link to="/" className="text-2xl font-bold text-white hover:text-cyan-400">
            Cinem<span className="text-cyan-400">AI</span>
          </Link>
          <nav className="flex gap-6 text-white">
            <Link to="/" className="flex items-center gap-1 hover:text-cyan-400"><Home size={16} /> Home</Link>
            <Link to="/movies" className="flex items-center gap-1 hover:text-cyan-400"><Film size={16} /> Movies</Link>
            <Link to="/tv-shows" className="flex items-center gap-1 hover:text-cyan-400"><Tv size={16} /> Series</Link>
            <Link to="/search" className="flex items-center gap-1 hover:text-cyan-400"><Search size={16} /> Search</Link>
          </nav>
          <div className="relative" ref={desktopUserRef}>
            <button onClick={() => setShowUsers((prev) => !prev)} className="hover:scale-110 transition-transform text-white">
              <User size={24} />
            </button>
            <div
              className={`absolute right-0 top-full mt-2 z-50 bg-zinc-800 text-white rounded shadow-lg w-48 p-4 transform transition-all duration-300 origin-top ${
                showUsers ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
              }`}
            >
              <h3 className="font-semibold mb-2">Users</h3>
              <ul className="space-y-2">
                <li><Link to="/user/1" onClick={() => setShowUsers(false)} className="hover:text-cyan-400 block">User 1</Link></li>
                <li><Link to="/user/2" onClick={() => setShowUsers(false)} className="hover:text-cyan-400 block">User 2</Link></li>
                <li><Link to="/user/3" onClick={() => setShowUsers(false)} className="hover:text-cyan-400 block">User 3</Link></li>
              </ul>
              <hr className="my-2 border-zinc-600" />
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 text-sm text-white hover:text-blue-400 px-2 py-1"
              >
                <Settings size={16} /> Setări
              </button>
              <button
                onClick={() => {
                  setShowUsers(false);
                  navigate("/login");
                }}
                className="text-sm hover:text-red-400"
              >
                Delogare
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-10 relative">
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
              <Route path="/movies" element={<h2 className="text-xl">Movies Page (în lucru)</h2>} />
              <Route path="/tv-shows" element={<h2 className="text-xl">TV Shows Page (în lucru)</h2>} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/film/:id"
                element={
                  <OutsideClickWrapper redirectTo={location.state?.fromSearch ? "/search" : "/"}>
                    <FilmPage />
                  </OutsideClickWrapper>
                }
              />
              <Route
                path="/settings"
                element={
                  <OutsideClickWrapper redirectTo="/">
                    <div className="settings-wrapper">
                      <SettingsPage />
                    </div>
                  </OutsideClickWrapper>
                }
              />
              <Route path="/user/:id" element={<UserPage />} />
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