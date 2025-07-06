// Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Home, Film, Tv, User, LogOut, Menu, Settings, Pencil } from "lucide-react";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

function Header({ showUsers, setShowUsers, userMenuRef }) {
  const { user, login, logout, loading, setLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [clickedFromButton, setClickedFromButton] = useState(false);

  const isActive = (path) => location.pathname === path;

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
    <header className="w-full bg-black/30 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-4 flex items-center justify-between relative z-[9999] border-b border-zinc-800 shadow-none">
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
        {user && (
          <span className="hidden sm:inline text-sm bg-zinc-800 px-3 py-1 rounded-full">
            {user.user_metadata?.username || user.email}
          </span>
        )}
        <div className="relative">
          <button
            onClick={() => {
              setClickedFromButton(true);
              setShowUsers((prev) => !prev);
            }}
            className="flex items-center gap-2 hover:text-cyan-400 text-sm sm:text-base"
          >
            <User size={18} /> Profil
          </button>

          <AnimatePresence>
  {showUsers && (
    <motion.div
  ref={userMenuRef}
  className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-600 shadow-lg z-[9999]"
  initial={{ opacity: 0, scaleY: 0 }}
  animate={{ opacity: 1, scaleY: 1 }}
  exit={{ opacity: 0, scaleY: 0 }}
  transition={{ duration: 0.2 }}
  style={{
    originY: 0,
    backgroundColor: "rgba(30, 30, 30, 0.6)",  // fundal negru semi-transparent
    backdropFilter: "blur(20px)",              // blur mai puternic
    WebkitBackdropFilter: "blur(20px)",        // suport Safari
    borderColor: "rgba(255, 255, 255, 0.1)"
  }}
>

      <ul className="divide-y divide-zinc-700">
        {user && (
          <li>
            <div className="px-4 py-2 text-zinc-400">
              Autentificat ca {user.user_metadata?.username || user.email}
            </div>
          </li>
        )}
      </ul>
      <div className="px-4 py-2 border-t border-zinc-700">
        {user ? (
          <>
            <button
              onClick={() => {
                setShowUsers(false);
                navigate("/manage-profiles");
              }}
              className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 mb-2"
            >
              <Pencil size={16} /> Manage Profiles
            </button>
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
          </>
        ) : (
          <>
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
              onClick={() => {
                setShowUsers(false);
                navigate("/register");
              }}
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <User size={16} /> Register
            </button>
          </>
        )}
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
