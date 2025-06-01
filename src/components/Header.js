// Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Film, Tv, User, Moon, Sun, Settings, LogOut } from "lucide-react";
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
    <header className="w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-bold flex items-center transition-opacity hover:opacity-80">
          <span className="text-white">Cinem</span>
          <span className="text-cyan-400">AI</span>
        </Link>
        <nav className="flex gap-6 text-white">
          <Link to="/" className="flex items-center gap-2 hover:text-cyan-400">
            <Home size={20} /> Home
          </Link>
          <Link to="/movies" className="flex items-center gap-2 hover:text-cyan-400">
            <Film size={20} /> Movies
          </Link>
          <Link to="/tv-shows" className="flex items-center gap-2 hover:text-cyan-400">
            <Tv size={20} /> TV Shows
          </Link>
          <Link to="/search" className="flex items-center gap-2 hover:text-cyan-400">
            <Search size={20} /> Search
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4 relative" ref={userMenuRef}>
        <button onClick={toggleDarkMode} className="hover:scale-110 transition-transform text-white">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={() => setShowUsers(!showUsers)} className="hover:scale-110 transition-transform text-white">
          <User size={24} />
        </button>
        <div className={`absolute right-0 top-full mt-2 z-50 bg-zinc-800 text-white rounded shadow-lg w-48 p-4 ${showUsers ? "block" : "hidden"}`}>
          <h3 className="font-semibold mb-2">Users</h3>
          <ul className="space-y-2">
            {['User 1', 'User 2', 'User 3'].map((name) => (
              <li
                key={name}
                onClick={() => handleSwitchUser(name)}
                className="cursor-pointer hover:text-cyan-400"
              >
                {name}
              </li>
            ))}
          </ul>
          <hr className="my-2 border-zinc-600" />
          <Link to="/settings" className="flex items-center gap-2 text-sm hover:text-blue-400 px-2 py-1 cursor-pointer" onClick={() => setShowUsers(false)}>
            <Settings size={16} /> Setări
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm hover:text-red-400 px-2 py-1 cursor-pointer w-full mt-2"
          >
            <LogOut size={16} /> Delogare
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
