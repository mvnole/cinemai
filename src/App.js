// App.js
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Home, Film, Tv, User, Moon, Sun, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import { FilmPage } from "./components/FilmPage";
import { SettingsPage } from "./components/SettingsPage";
import OutsideClickWrapper from "./components/OutsideClickWrapper";
import UserPage from "./pages/UserPage";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const userMenuRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
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

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? "bg-black text-white" : "bg-white text-black"} min-h-screen flex flex-col`}>
      <header className="w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors">
            Cinem<span className="text-cyan-400">AI</span>
          </Link>
          <nav className="flex gap-6 text-white">
            <Link to="/" className="flex items-center gap-2 hover:text-cyan-400"><Home size={20} /> Home</Link>
            <Link to="/movies" className="flex items-center gap-2 hover:text-cyan-400"><Film size={20} /> Movies</Link>
            <Link to="/tv-shows" className="flex items-center gap-2 hover:text-cyan-400"><Tv size={20} /> TV Shows</Link>
            <Link to="/search" className="flex items-center gap-2 hover:text-cyan-400"><Search size={20} /> Search</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 relative" ref={userMenuRef} data-user-menu>
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

          <button onClick={toggleDarkMode} className="hover:scale-110 transition-transform text-white">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setShowUsers(!showUsers)} className="hover:scale-110 transition-transform text-white">
            <User size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/film/:id"
                element={
                  <OutsideClickWrapper redirectTo={location.state?.fromSearch ? "/search" : "/"}>
                    <FilmPage />
                  </OutsideClickWrapper>
                }
              />
              <Route path="/movies" element={<h2 className="text-xl">Movies Page (în lucru)</h2>} />
              <Route path="/tv-shows" element={<h2 className="text-xl">TV Shows Page (în lucru)</h2>} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<OutsideClickWrapper redirectTo="/">
                <div className="settings-wrapper">
                  <SettingsPage />
                </div>
              </OutsideClickWrapper>} />
              <Route path="/user/:id" element={<UserPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
