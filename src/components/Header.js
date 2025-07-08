import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Home, Film, Tv, User, Menu } from "lucide-react";
import { useUser } from "../context/UserContext";
import UserDropdown from "./UserDropdown"; // presupun că ai componenta asta deja
import { AnimatePresence, motion } from "framer-motion";

function Header() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setShowUsers(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  return (
    <header className="w-full bg-[#18181b] md:bg-black/30 md:backdrop-blur-md px-3 py-2 sm:px-4 sm:py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-[100] border-b border-zinc-800 shadow-none">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* HAMBURGER */}
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
          <Link
            to="/"
            className={`flex items-center gap-2 px-2 py-1 ${
              isActive("/") ? "text-cyan-400" : "hover:text-cyan-400"
            }`}
          >
            <Home size={20} /> Home
          </Link>
          <Link
            to="/search"
            className={`flex items-center gap-2 px-2 py-1 ${
              isActive("/search") ? "text-cyan-400" : "hover:text-cyan-400"
            }`}
          >
            <Search size={20} /> Search
          </Link>
          <Link
            to="/films"
            className={`flex items-center gap-2 px-2 py-1 ${
              isActive("/films") ? "text-cyan-400" : "hover:text-cyan-400"
            }`}
          >
            <Film size={20} /> Films
          </Link>
          <Link
            to="/series"
            className={`flex items-center gap-2 px-2 py-1 ${
              isActive("/series") ? "text-cyan-400" : "hover:text-cyan-400"
            }`}
          >
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
            onClick={() => setShowUsers((prev) => !prev)}
            className="flex items-center gap-2 hover:text-cyan-400 text-sm sm:text-base"
            ref={userMenuRef}
          >
            <User size={18} /> Profil
          </button>

          <UserDropdown
            showUsers={showUsers}
            setShowUsers={setShowUsers}
            userMenuRef={userMenuRef}
          />
        </div>
      </div>

      {/* MENIU HAMBURGER MOBILE CU BLUR TRANSPARENT */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed top-0 left-0 w-[80vw] max-w-xs h-full z-[999] flex flex-col py-8 px-6 gap-4 shadow-2xl bg-black/60 backdrop-blur-xl border-r border-white/10"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.22 }}
          >
            <button
              onClick={() => setShowMobileMenu(false)}
              className="self-end mb-8 text-gray-200 hover:text-white text-2xl"
              aria-label="Close menu"
            >
              ✕
            </button>
            <Link to="/" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-100" onClick={() => setShowMobileMenu(false)}>
              <Home size={20} /> Home
            </Link>
            <Link to="/films" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-100" onClick={() => setShowMobileMenu(false)}>
              <Film size={20} /> Films
            </Link>
            <Link to="/series" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-100" onClick={() => setShowMobileMenu(false)}>
              <Tv size={20} /> Series
            </Link>
            <Link to="/search" className="flex items-center gap-2 py-2 text-lg hover:text-cyan-100" onClick={() => setShowMobileMenu(false)}>
              <Search size={20} /> Search
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
