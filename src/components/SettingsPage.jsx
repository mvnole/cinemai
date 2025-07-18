import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

// Lista limbilor
const LANGUAGES = [
  { value: "ro", label: "Română" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];
// Lista calităților video
const QUALITIES = [
  { value: "auto", label: "Auto" },
  { value: "1080p", label: "Full HD (1080p)" },
  { value: "720p", label: "HD (720p)" },
  { value: "480p", label: "SD (480p)" },
];
// Lista temelor vizuale
const THEMES = [
  { value: "auto", label: "Auto (system)" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export function SettingsPage() {
  const { user } = useUser();
  const [account, setAccount] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  const [uploading, setUploading] = useState(false);
  const inputFileRef = useRef();

  // Preferințe UI locale (pot fi salvate în DB dacă vrei)
  const [language, setLanguage] = useState(LANGUAGES[0].value);
  const [quality, setQuality] = useState(QUALITIES[0].value);
  const [theme, setTheme] = useState(THEMES[0].value);
  const [subtitles, setSubtitles] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(false);

  // 1. Fetch date cont la load
  useEffect(() => {
    if (!user?.id) {
      setAccount(null);
      setLoadingAccount(false);
      return;
    }
    setLoadingAccount(true);
    async function fetchAccount() {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, username, email, full_name, birth_date, gender")
        .eq("id", user.id)
        .single();

      if (data) setAccount(data);
      setLoadingAccount(false);
    }
    fetchAccount();
  }, [user?.id]);

  // 2. Upload avatar cont principal
  const handleAvatarClick = () => inputFileRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !account) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${account.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      alert("Upload failed!");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = data.publicUrl;
    // Update cont principal
    const { error: updateError } = await supabase
      .from("accounts")
      .update({ avatar_url: avatarUrl })
      .eq("id", account.id);
    if (!updateError) setAccount({ ...account, avatar_url: avatarUrl });
    setUploading(false);
  };

  // 3. Logout user principal
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loadingAccount) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-cyan-400 text-xl font-bold animate-pulse">
          Loading settings...
        </div>
      </div>
    );
  }
  if (!account) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-400 text-xl font-bold">
          User not found or not logged in.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-2">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="
          w-full max-w-5xl
          flex flex-col md:flex-row gap-0 md:gap-8
          bg-zinc-900/80 rounded-2xl shadow-2xl border border-zinc-800/60
          backdrop-blur-xl
          overflow-hidden
        "
      >
        {/* Stânga: Cont user */}
        <div className="
          flex flex-col items-center justify-center
          min-w-[260px] max-w-[320px] bg-zinc-900/90 py-10 px-5
          border-b md:border-b-0 md:border-r border-zinc-800/60
        ">
          <div className="relative group mb-3">
            <img
              src={
                account.avatar_url
                  ? account.avatar_url
                  : `https://ui-avatars.com/api/?name=${account.username}`
              }
              alt={account.username}
              className="w-24 h-24 rounded-full border-4 border-cyan-500 object-cover shadow mb-2 cursor-pointer hover:opacity-80 transition"
              onClick={handleAvatarClick}
            />
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cyan-700/90 px-3 py-1.5 text-xs rounded-full shadow font-semibold hover:bg-cyan-600 transition hidden group-hover:block"
              style={{ zIndex: 2 }}
              type="button"
            >
              {uploading ? "Uploading..." : "Change avatar"}
            </button>
          </div>
          <div className="text-2xl font-bold mb-1 text-center">{account.username}</div>
          <div className="text-gray-400 text-sm mb-1 text-center break-all">{account.email}</div>
          <div className="text-gray-500 text-xs text-center mb-2">{account.full_name}</div>
          {account.birth_date && (
            <div className="text-gray-500 text-xs text-center mb-2">Birth date: {account.birth_date}</div>
          )}
          {account.gender && (
            <div className="text-gray-500 text-xs text-center mb-2">Gender: {account.gender}</div>
          )}
          <button
            className="mt-8 text-red-500 hover:underline focus:underline focus:text-red-400 transition text-base"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>

        {/* Dreapta: Setări */}
        <div className="flex-1 flex flex-col justify-center py-10 px-6 md:px-12 space-y-8">
          <h2 className="text-3xl font-extrabold mb-2">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <label className="block mb-1 font-semibold">Language</label>
              <Dropdown options={LANGUAGES} value={language} setValue={setLanguage} />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Theme</label>
              <Dropdown options={THEMES} value={theme} setValue={setTheme} />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Video Quality</label>
              <Dropdown options={QUALITIES} value={quality} setValue={setQuality} />
            </div>
            <div className="flex items-center gap-3 group cursor-pointer select-none mt-2 md:mt-0">
              <Toggle checked={autoplay} onChange={setAutoplay} />
              <label className="font-semibold group-hover:text-cyan-400 transition">
                Autoplay next episode
              </label>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <Toggle checked={subtitles} onChange={setSubtitles} />
              <label className="font-semibold group-hover:text-cyan-400 transition">
                Default subtitles
              </label>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <Toggle checked={notifications} onChange={setNotifications} />
              <label className="font-semibold group-hover:text-cyan-400 transition">
                New content notifications
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-10">
            <button className="bg-cyan-600 hover:bg-cyan-500 transition px-6 py-2.5 rounded font-semibold shadow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-cyan-400 text-lg">
              Save settings
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Dropdown animat custom
function Dropdown({ options, value, setValue }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        className="w-full flex justify-between items-center bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 shadow focus:outline-cyan-500 cursor-pointer transition-all duration-200 hover:border-cyan-500 focus:border-cyan-500"
        onClick={() => setOpen(o => !o)}
        type="button"
        tabIndex={0}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        <span>
          {options.find(o => o.value === value)?.label}
        </span>
        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 mt-2 z-20 bg-zinc-900 rounded-xl border border-zinc-700 shadow-lg overflow-hidden"
          >
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={() => {
                  setValue(opt.value);
                  setOpen(false);
                }}
                className={`px-5 py-2 cursor-pointer transition-colors select-none ${
                  value === opt.value
                    ? "bg-cyan-700 text-white"
                    : "hover:bg-zinc-800 hover:text-cyan-300"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// Toggle switch modern
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 outline-none ring-0
        ${checked ? "bg-cyan-500" : "bg-zinc-700"}`}
      tabIndex={0}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200
        ${checked ? "translate-x-7" : "translate-x-1"} `}
      />
    </button>
  );
}
