import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Lock, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import CinemaCurtains from "./CinemaCurtains";

export default function UserDropdown({ showUsers, setShowUsers, userMenuRef }) {
  const { user, logout, selectProfile, activeProfile, profiles } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Draperii (apar doar pe durata tranziției)
  const [curtainsClosing, setCurtainsClosing] = useState(false);

  // ---- Hover control (desktop) ----
  const hoverCloseTimeout = useRef(null);
  const isDesktop = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

  const openMenu = () => {
    if (hoverCloseTimeout.current) clearTimeout(hoverCloseTimeout.current);
    setShowUsers(true);
  };
  const scheduleClose = () => {
    if (hoverCloseTimeout.current) clearTimeout(hoverCloseTimeout.current);
    hoverCloseTimeout.current = setTimeout(() => setShowUsers(false), 150);
  };

  // Hover pe buton (trigger)
  useEffect(() => {
    const triggerEl = userMenuRef?.current;
    if (!triggerEl) return;
    const onEnter = () => { if (isDesktop()) openMenu(); };
    const onLeave = () => { if (isDesktop()) scheduleClose(); };
    triggerEl.addEventListener("mouseenter", onEnter);
    triggerEl.addEventListener("mouseleave", onLeave);
    return () => {
      triggerEl.removeEventListener("mouseenter", onEnter);
      triggerEl.removeEventListener("mouseleave", onLeave);
    };
  }, [userMenuRef]);

  // Hover pe dropdown
  useEffect(() => {
    const dd = dropdownRef.current;
    if (!dd) return;
    const onEnter = () => { if (isDesktop()) openMenu(); };
    const onLeave = () => { if (isDesktop()) scheduleClose(); };
    dd.addEventListener("mouseenter", onEnter);
    dd.addEventListener("mouseleave", onLeave);
    return () => {
      dd.removeEventListener("mouseenter", onEnter);
      dd.removeEventListener("mouseleave", onLeave);
    };
  }, [showUsers]);

  // Cleanup timeout la unmount
  useEffect(() => () => {
    if (hoverCloseTimeout.current) clearTimeout(hoverCloseTimeout.current);
  }, []);

  // Click în afară => închide (fallback mobil)
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
      setShowUsers(false);
      navigate(`/profiles/${profile.id}/unlock`);
      return;
    }
    // 1) pornește draperiile
    setCurtainsClosing(true);
    // 2) schimbă profilul când “se ating” în centru (≈ 300–400ms)
    setTimeout(() => {
      selectProfile(profile.id);
      setShowUsers(false);
    }, 350);
    // 3) demontarea draperiilor o face componenta când termină secvența
  };

  const handleLogout = () => {
    logout();
    setShowUsers(false);
    navigate("/register");
  };

  const accountPath = user
    ? `/user/${user.user_metadata?.username || user.id}`
    : "/login";

  return (
    <>
      {/* Draperii realiste – se montează doar pe durata animației */}
      {curtainsClosing && (
        <CinemaCurtains
          active
          onComplete={() => {
            setCurtainsClosing(false);
          }}
        />
      )}

      <AnimatePresence>
        {showUsers && (
          <motion.div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-64 md:w-[28rem] rounded-xl shadow-lg border border-white/20 z-50 overflow-hidden bg-black/80 backdrop-blur-md max-h-[70vh]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {!user ? (
              <div className="px-5 py-4">
                <button
                  onClick={() => {
                    setShowUsers(false);
                    navigate("/login");
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-base text-green-400 hover:text-green-300"
                >
                  <PlusCircle size={18} /> Sign Up
                </button>
              </div>
            ) : (
              <>
                {/* Lista de profile */}
                <ul className="divide-y divide-gray-700 overflow-y-auto">
                  {(profiles || []).map((p) => (
                    <li
                      key={p.id}
                      onClick={() => onSelectProfile(p)}
                      tabIndex={0}
                      className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-700 cursor-pointer
                        ${activeProfile?.id === p.id ? "bg-cyan-900/70 font-bold text-cyan-300" : "text-white"}
                      `}
                    >
                      <img
                        src={p.avatar_url || "/default-avatar.png"}
                        alt={p.name}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                      />
                      <span className="flex-1 text-sm md:text-base truncate">{p.name}</span>
                      {p.is_locked && <Lock size={16} className="text-gray-400" />}
                      {activeProfile?.id === p.id && (
                        <span className="ml-2 text-[10px] md:text-xs px-2 py-0.5 rounded bg-cyan-700 text-white">
                          Current
                        </span>
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
                      className="flex items-center gap-2 w-full px-5 py-3 text-base text-yellow-400 hover:text-yellow-300"
                    >
                      <User size={18} /> Manage Profiles
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowUsers(false);
                        navigate("/settings");
                      }}
                      className="flex items-center gap-2 w-full px-5 py-3 text-base text-blue-400 hover:text-blue-300"
                    >
                      <Settings size={18} /> Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowUsers(false);
                        navigate(accountPath);
                      }}
                      className="flex items-center gap-2 w-full px-5 py-3 text-base text-gray-100 hover:text-white"
                    >
                      <User size={18} /> Account
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowUsers(false);
                        navigate("/subscription");
                      }}
                      className="flex items-center gap-2 w-full px-5 py-3 text-base text-green-400 hover:text-green-300"
                    >
                      <User size={18} /> Subscription
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowUsers(false);
                        navigate("/privacy");
                      }}
                      className="flex items-center gap-2 w-full px-5 py-3 text-base text-gray-400 hover:text-gray-200"
                    >
                      <Lock size={18} /> Privacy & Legal
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-5 py-3 text-base text-red-400 hover:text-red-300"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </li>
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
