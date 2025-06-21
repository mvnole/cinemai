import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Home, Film, Tv, User, LogOut, Menu, Settings } from "lucide-react";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

function Header({ showUsers, setShowUsers, userMenuRef }) {
  const { user, login, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [clickedFromButton, setClickedFromButton] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSwitchUser = (name) => {
    login(name);
    setShowUsers(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    setShowUsers(false);
    setShowMobileMenu(false);
    navigate("/register");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (clickedFromButton) {
        setClickedFromButton(false);
        return;
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUsers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowUsers, userMenuRef, clickedFromButton]);

  return (
    <header className="w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 px-3 py-2 sm:px-4 sm:py-4 flex items-center justify-between relative z-[9999]">
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          className="md:hidden flex items-center justify-center mr-2"
          onClick={() => setShowMobileMenu((v) => !v)}
          aria-label="Open menu"
        >
          <Menu size={32} className="text-white" />
        </button>

        <Link
          to="/"
          className="text-2xl sm:text-4xl font-bold flex items-center transition-opacity hover:opacity-80"
        >
          <span className="text-white">Cinem</span>
          <span className="text-cyan-400">AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-white text-base font-medium">
          <Link to="/" className={`flex items-center gap-2 px-2 py-1 ${isActive("/") ? "text-cyan-400" : "hover:text-cyan-400"}`}>
            <Home size={20} /> Home
          </Link>
          <Link to="/search" className={`flex items-center gap-2 px-2 py-1 ${isActive("/search") ? "text-cyan-400" : "hover:text-cyan-400"}`}>
            <Search size={20} /> Search
          </Link>
          <Link to="/films" className={`flex items-center gap-2 px-2 py-1 ${isActive("/films") ? "text-cyan-400" : "hover:text-cyan-400"}`}>
            <Film size={20} /> Films
          </Link>
          <Link to="/series" className={`flex items-center gap-2 px-2 py-1 ${isActive("/series") ? "text-cyan-400" : "hover:text-cyan-400"}`}>
            <Tv size={20} /> Series
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 text-white">
        <div className="relative">
          <button
            onClick={() => {
              setClickedFromButton(true);
              setShowUsers((prev) => !prev);
            }}
            className="flex items-center gap-2 hover:text-cyan-400 text-sm sm:text-base"
          >
            <User size={18} /> {user?.name || "Guest"}
          </button>

          <AnimatePresence>
            {showUsers && (
              <motion.div
                ref={userMenuRef}
                className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-[9999]"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.2 }}
                style={{ originY: 0 }}
              >
                <div className="px-4 py-2 text-sm text-zinc-300">Switch User</div>
                <ul className="divide-y divide-zinc-700">
                  {["Alex", "Mira", "Leo"].map((name) => (
                    <li key={name}>
                      <button
                        onClick={() => handleSwitchUser(name)}
                        className="w-full px-4 py-2 text-left hover:bg-zinc-700 text-white"
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 border-t border-zinc-700">
                  <button
                    onClick={() => {
                      setShowUsers(false);
                      navigate("/settings");
                    }}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-2"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-[998] bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              className="fixed top-0 left-0 w-64 h-full z-[999] bg-zinc-900 border-r border-zinc-800 flex flex-col py-8 px-6 gap-4 shadow-2xl"
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
              <Link to="/films" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-400" onClick={() => setShowMobileMenu(false)}>
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
    </header>
  );
}

export default Header;
