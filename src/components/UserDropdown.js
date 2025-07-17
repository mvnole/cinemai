import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Lock, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";

export default function UserDropdown({ showUsers, setShowUsers, userMenuRef }) {
  const { user, logout, selectProfile, activeProfile } = useUser();
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch profiles pentru user activ
  useEffect(() => {
    if (!user || !showUsers) return;
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, is_locked")
        .eq("user_id", user.id)
        .order("name", { ascending: true });
      setProfiles(!error && data ? data : []);
    };
    fetchProfiles();
  }, [user, showUsers]);

  // Close dropdown la click în afara lui
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

  const onSelectProfile = (profile) => {
    if (profile.is_locked) {
      navigate(`/profiles/${profile.id}/unlock`);
      setShowUsers(false);
      return;
    }
    selectProfile(profile.id); // persistă și în context și localStorage
    setShowUsers(false);
    // navigate("/") dacă vrei redirect după selectare profil
  };

  const handleLogout = () => {
    logout();
    setShowUsers(false);
    navigate("/register");
  };

  // Link către pagina de user principal (cont auth)
  const accountPath = user
    ? `/user/${user.user_metadata?.username || user.id}`
    : "/login";

  return (
    <AnimatePresence>
      {showUsers && (
        <motion.div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg border border-white/20 z-50 overflow-hidden bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {!user ? (
            <div className="px-4 py-3">
              <button
                onClick={() => {
                  setShowUsers(false);
                  navigate("/login");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-400 hover:text-green-300"
              >
                <PlusCircle size={16} /> Sign Up
              </button>
            </div>
          ) : (
            <>
              {/* Lista de profile */}
              <ul className="divide-y divide-gray-700">
                {profiles.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    tabIndex={0}
                    className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer
                      ${activeProfile?.id === p.id ? "bg-cyan-900/70 font-bold text-cyan-300" : ""}
                    `}
                  >
                    <img
                      src={p.avatar_url || "/default-avatar.png"}
                      alt={p.name}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={e => { e.currentTarget.src = "/default-avatar.png"; }}
                    />
                    <span className="flex-1 text-white text-sm truncate">{p.name}</span>
                    {p.is_locked && <Lock size={14} className="text-gray-400" />}
                    {activeProfile?.id === p.id && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-cyan-700 text-white">Current</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-700" />
              <ul className="py-2">
                <li>
                  <button
                    onClick={() => {
                      setShowUsers(false);
                      navigate("/manage-profiles");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300"
                  >
                    <User size={16} /> Manage Profiles
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowUsers(false);
                      navigate("/settings");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <Settings size={16} /> Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowUsers(false);
                      navigate(accountPath);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-100 hover:text-white"
                  >
                    <User size={16} /> Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowUsers(false);
                      navigate("/subscription");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-400 hover:text-green-300"
                  >
                    <User size={16} /> Subscription
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowUsers(false);
                      navigate("/privacy");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
                  >
                    <Lock size={16} /> Privacy & Legal
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </li>
              </ul>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
