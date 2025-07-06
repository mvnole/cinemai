import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ro", label: "Romanian" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "it", label: "Italian" }
];
const QUALITIES = [
  { value: "auto", label: "Auto" },
  { value: "480p", label: "480p" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
  { value: "4k", label: "4K" }
];
const THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" }
];

export function SettingsPage() {
  const [language, setLanguage] = useState(LANGUAGES[0].value);
  const [quality, setQuality] = useState(QUALITIES[0].value);
  const [theme, setTheme] = useState(THEMES[0].value);
  const [subtitles, setSubtitles] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [profileLock, setProfileLock] = useState(false);

  const user = {
    name: "Admin",
    email: "admin@cinemai.live",
    avatar: "https://ui-avatars.com/api/?name=Admin&background=1a1a2e&color=fff"
  };

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #0e7490 60%, #9333ea 100%)",
        }}
      />
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="w-full max-w-3xl p-8 bg-zinc-900/90 text-white rounded-2xl shadow-2xl space-y-8 backdrop-blur-sm border border-zinc-800/40">
          {/* Profile Card */}
          <div className="flex items-center gap-5 p-6 bg-zinc-800/80 rounded-xl shadow mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border-4 border-cyan-500 object-cover"
            />
            <div>
              <div className="text-xl font-bold">{user.name}</div>
              <div className="text-gray-400 text-sm">{user.email}</div>
            </div>
            <button className="ml-auto px-4 py-2 bg-cyan-600 rounded-full font-semibold hover:bg-cyan-500 focus:ring-2 focus:ring-cyan-300 transition shadow hover:scale-105 active:scale-95">
              Change avatar
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">Account Settings</h2>

          <div className="space-y-6">

            {/* Custom Animated Dropdowns */}
            <div>
              <label className="block mb-1 font-semibold">Interface Language</label>
              <Dropdown
                options={LANGUAGES}
                value={language}
                setValue={setLanguage}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Default Video Quality</label>
              <Dropdown
                options={QUALITIES}
                value={quality}
                setValue={setQuality}
              />
            </div>

            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <Toggle checked={subtitles} onChange={setSubtitles} />
              <label className="font-semibold group-hover:text-cyan-400 transition">Enable default subtitles</label>
            </div>

            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <Toggle checked={autoplay} onChange={setAutoplay} />
              <label className="font-semibold group-hover:text-cyan-400 transition">Autoplay next episode</label>
            </div>

            <div>
              <label className="block mb-1 font-semibold">App Theme</label>
              <Dropdown
                options={THEMES}
                value={theme}
                setValue={setTheme}
              />
            </div>

            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <Toggle checked={notifications} onChange={setNotifications} />
              <label className="font-semibold group-hover:text-cyan-400 transition">Enable new content notifications</label>
            </div>

            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <Toggle checked={profileLock} onChange={setProfileLock} />
              <label className="font-semibold group-hover:text-cyan-400 transition">Profile lock (password)</label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-8">
            <button className="bg-cyan-600 hover:bg-cyan-500 transition px-4 py-2 rounded font-semibold shadow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-cyan-400">
              Save settings
            </button>
            <button className="text-red-500 hover:underline focus:underline focus:text-red-400 transition">Sign out</button>
          </div>
        </div>
      </div>
    </>
  );
}

// Custom dropdown animated
function Dropdown({ options, value, setValue }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown on click outside
  React.useEffect(() => {
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
