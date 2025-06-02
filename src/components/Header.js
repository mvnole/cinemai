import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Film, Tv, User, Moon, Sun, LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";

function Header({ darkMode, toggleDarkMode, showUsers, setShowUsers, userMenuRef }) {
  const { user, login, logout } = useUser();
  const navigate = useNavigate();

  const handleSwitchUser = (name) => {
    login(name);
    setShowUsers(false);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    setShowUsers(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 px-3 py-2 sm:px-4 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-6 sm:gap-10">
        <Link to="/" className="text-2xl sm:text-4xl font-bold flex items-center transition-opacity hover:opacity-80">
          <span className="text-white">Cinem</span>
          <span className="text-cyan-400">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-white text-sm">
          <Link to="/" className="flex items-center gap-1 hover:text-cyan-400">
            <Home size={16} /> Home
          </Link>
          <Link to="/search" className="flex items-center gap-1 hover:text-cyan-400">
            <Search size={16} /> Search
          </Link>
          <Link to="/films" className="flex items-center gap-1 hover:text-cyan-400">
            <Film size={16} /> Films
          </Link>
          <Link to="/series" className="flex items-center gap-1 hover:text-cyan-400">
            <Tv size={16} /> Series
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 text-white">
        <button onClick={toggleDarkMode} className="hover:text-cyan-400">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="flex items-center gap-2 hover:text-cyan-400 text-sm sm:text-base"
          >
            <User size={18} /> {user?.name || "Guest"}
          </button>

          {showUsers && (
            <div
              ref={userMenuRef}
              className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-10"
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
              <div className="px-4 py-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
