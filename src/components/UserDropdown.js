import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function UserDropdown({ showUsers, setShowUsers, userMenuRef }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowUsers(false);
    navigate("/register");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowUsers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowUsers, userMenuRef]);

  return (
    <AnimatePresence>
      {showUsers && (
        <motion.div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border border-white/10 z-[9999] overflow-hidden bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ul className="divide-y divide-zinc-700">
            {user && (
              <li>
                <div className="px-4 py-2 text-zinc-100">
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
                  className="flex items-center gap-2 text-sm text-yellow-300 hover:text-yellow-200 mb-2"
                >
                  <Pencil size={16} /> Manage Profiles
                </button>
                <button
                  onClick={() => {
                    setShowUsers(false);
                    navigate("/settings");
                  }}
                  className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 mb-2"
                >
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-red-300 hover:text-red-200"
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
                  className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 mb-2"
                >
                  <Settings size={16} /> Settings
                </button>
                <Link
                  to="/register"
                  onClick={() => setShowUsers(false)}
                  className="flex items-center gap-2 text-sm text-green-300 hover:text-green-200"
                >
                  <User size={16} /> Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
