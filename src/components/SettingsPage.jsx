// src/components/SettingsPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, LogOut } from "lucide-react";
import { supabase } from "../utils/supabaseClient";
import { useUser } from "../context/UserContext";

// (opțional) dacă ai ProfilesContext; codul merge și fără
let useProfiles;
try {
  useProfiles = require("../context/ProfilesContext").useProfiles;
} catch (_) {
  useProfiles = () => null;
}

// Options
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ro", label: "Română" },
  { value: "fr", label: "Français" },
];
const QUALITIES = [
  { value: "auto", label: "Auto" },
  { value: "1080p", label: "Full HD (1080p)" },
  { value: "720p", label: "HD (720p)" },
  { value: "480p", label: "SD (480p)" },
];
const THEMES = [
  { value: "auto", label: "Auto (system)" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

/** Helpers pentru stocare locală per profil */
const lsKey = (profileId) => `cinemai:prefs:${profileId}`;
function loadLocalPrefs(profileId) {
  try {
    const raw = localStorage.getItem(lsKey(profileId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function saveLocalPrefs(profileId, prefs) {
  try {
    localStorage.setItem(lsKey(profileId), JSON.stringify(prefs));
  } catch {}
}

function SettingsPage() {
  // User
  const ctx = useUser?.() || {};
  const ctxUser = ctx.user || null;

  // Profiles context (dacă există)
  const profilesCtx = useProfiles?.() || null;

  // Refs
  const inputFileRef = useRef(null);

  // Auth state
  const [authResolved, setAuthResolved] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Profiles state
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [profile, setProfile] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // {type: 'ok'|'error'|'info', text}

  // Profile fields (DB-backed)
  const [profileName, setProfileName] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // Preferences (local, per profil)
  const [language, setLanguage] = useState("en");
  const [quality, setQuality] = useState("auto");
  const [theme, setTheme] = useState("auto");
  const [subtitles, setSubtitles] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(false);

  // ---------- AUTH ----------
  useEffect(() => {
    let cancelled = false;
    async function resolveAuth() {
      try {
        if (ctxUser?.id) {
          if (cancelled) return;
          setUserId(ctxUser.id);
          setUserEmail(ctxUser.email || ctxUser.user_metadata?.email || null);
          setAuthResolved(true);
          return;
        }
        const { data, error } = await supabase.auth.getUser();
        if (cancelled) return;
        if (error) console.warn("[Settings] getUser error:", error?.message);
        const u = data?.user || null;
        setUserId(u?.id || null);
        setUserEmail(u?.email || u?.user_metadata?.email || null);
        setAuthResolved(true);
      } catch (e) {
        if (cancelled) return;
        console.warn("[Settings] resolveAuth threw:", e);
        setUserId(null);
        setAuthResolved(true);
      }
    }
    resolveAuth();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxUser?.id]);

  // ---------- LOAD PROFILES ----------
  useEffect(() => {
    if (!authResolved || !userId) return;
    let isMounted = true;

    async function fetchProfiles() {
      setLoading(true);
      setMessage(null);

      let { data: profs, error } = await supabase
        .from("profiles")
        .select("id, user_id, name, avatar_url, created_at, is_locked")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("[Settings] profiles select error:", error.message);
        profs = [];
      }

      if (!isMounted) return;

      setProfiles(profs);

      // determină profilul activ: context -> localStorage -> primul
      const ctxActive = profilesCtx?.activeProfileId || null;
      const lsActive = localStorage.getItem("active_profile_id");
      const first = profs[0]?.id || null;

      const chosen =
        ctxActive ||
        (lsActive && profs.some((p) => p.id === lsActive) ? lsActive : null) ||
        first;

      setActiveProfileId(chosen);
      if (profilesCtx?.setActiveProfileId && chosen) {
        profilesCtx.setActiveProfileId(chosen);
      }
      setLoading(false);
    }

    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authResolved, userId]);

  // ---------- LOAD ACTIVE PROFILE + LOCAL PREFS ----------
  useEffect(() => {
    if (!activeProfileId) return;
    let cancelled = false;

    async function loadActiveProfile() {
      setLoading(true);
      setMessage(null);

      const { data: p, error } = await supabase
      .from("profiles")
      .select("id, user_id, name, avatar_url, created_at, is_locked")
      .eq("id", activeProfileId)
      .maybeSingle();

      if (error) {
        console.warn("[Settings] load profile error:", error.message);
      }

      if (cancelled) return;

      if (!p) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(p);
      setProfileName(p.name || "");
      setIsLocked(!!p.is_locked);

      // încarcă preferințele locale pentru acest profil
      const local = loadLocalPrefs(p.id) || {
        language: "en",
        quality: "auto",
        theme: "auto",
        subtitles: true,
        autoplay: true,
        notifications: false,
      };
      setLanguage(local.language);
      setQuality(local.quality);
      setTheme(local.theme);
      setSubtitles(!!local.subtitles);
      setAutoplay(!!local.autoplay);
      setNotifications(!!local.notifications);

      applyTheme(local.theme || "auto");

      // persistă id-ul activ
      localStorage.setItem("active_profile_id", p.id);

      setLoading(false);
    }

    loadActiveProfile();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId]);

  // ---------- THEME APPLY ----------
  const applyTheme = (t) => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    if (t === "dark") root.classList.add("theme-dark");
    else if (t === "light") root.classList.add("theme-light");
  };
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // ---------- ACTIONS ----------
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAvatarClick = () => inputFileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !userId) return;
    setMessage(null);

    const fileExt = (file.name.split(".").pop() || "png").toLowerCase();
    const fileName = `${Date.now()}.${fileExt}`;

    // ✅ path sigur pentru RLS: <auth.uid()>/<profile.id>/<filename>
    const filePath = `${userId}/${profile.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars") // ← exact numele bucketului
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      setMessage({ type: "error", text: uploadError.message || "Avatar upload failed." });
      return;
    }

    // URL public (dacă ai policy de select public pe bucket)
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = data?.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", profile.id);

    if (updateError) {
      setMessage({ type: "error", text: updateError.message || "Could not update avatar." });
    } else {
      setProfile((s) => (s ? { ...s, avatar_url: avatarUrl } : s));
      setMessage({ type: "ok", text: "Avatar updated." });
    }
  };

  const saveSettings = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    // 1) Salvează preferințele local, per profil
    const preferences = { language, quality, theme, subtitles, autoplay, notifications };
    saveLocalPrefs(profile.id, preferences);

    // 2) Salvează DB fields: name + is_locked (avatar se salvează la upload)
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ name: profileName, is_locked: isLocked })
      .eq("id", profile.id);

    if (dbError) {
      setMessage({ type: "error", text: dbError?.message || "Failed to save settings." });
    } else {
      setMessage({ type: "ok", text: "Settings saved for this profile." });
      setProfile((s) => (s ? { ...s, name: profileName, is_locked: isLocked } : s));
    }
    setSaving(false);
  };

  // ---------- RENDER ----------
  if (!authResolved || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#151820] via-[#13151b] to-[#181b23]">
        <div className="text-cyan-400 text-xl font-bold animate-pulse">Loading settings…</div>
      </div>
    );
  }

  if (authResolved && !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#151820] via-[#13151b] to-[#181b23]">
        <div className="text-red-400 text-xl font-bold">You are not signed in.</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#151820] via-[#13151b] to-[#181b23]">
        <div className="text-red-400 text-xl font-bold">
          No profile found. Create or select a profile first.
        </div>
      </div>
    );
  }

  const headerName = profileName || (userEmail ? userEmail.split("@")[0] : "Profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151820] via-[#13151b] to-[#181b23] flex items-center justify-center px-3 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-6xl bg-zinc-900/80 rounded-3xl border border-zinc-800/60 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left: profile card */}
        <aside className="md:w-[320px] bg-zinc-900/90 border-b md:border-b-0 md:border-r border-zinc-800/60 p-8 flex flex-col items-center gap-3">
          <div className="relative group">
            <img
              src={
                profile.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(headerName)}`
              }
              alt={headerName}
              className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow cursor-pointer hover:opacity-90 transition"
              onClick={handleAvatarClick}
            />
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-700/90 px-3 py-1.5 text-xs rounded-full shadow font-semibold hover:bg-cyan-600 transition"
              type="button"
            >
              Change avatar
            </button>
            <input ref={inputFileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Profile name"
            className="mt-3 w-full bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700 shadow focus:border-cyan-500 focus:outline-none"
          />

          <label className="mt-2 flex items-center gap-3 text-zinc-200">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="w-4 h-4 accent-cyan-500"
            />
            Locked profile
          </label>

          <button
            onClick={handleSignOut}
            className="mt-6 inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"
          >
            <LogOut size={18} /> Sign out
          </button>

          {/* Selector de profil dacă ai mai multe */}
          {profiles.length > 1 && (
            <div className="w-full mt-6">
              <div className="text-zinc-400 text-xs uppercase tracking-wide mb-2">Active profile</div>
              <select
                value={activeProfileId || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  setActiveProfileId(id);
                  profilesCtx?.setActiveProfileId?.(id);
                  localStorage.setItem("active_profile_id", id);
                }}
                className="w-full bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700 shadow hover:border-cyan-500 focus:border-cyan-500 focus:outline-none"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || "Profile"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </aside>

        {/* Right: settings (local, per profil) */}
        <section className="flex-1 p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Settings</h1>

          {message && (
            <div
              className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium break-words ${
                message.type === "error"
                  ? "bg-red-500/15 text-red-300 border-red-400/30"
                  : message.type === "ok"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                  : "bg-zinc-700/30 text-zinc-200 border-zinc-600/40"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Interface language">
              <Dropdown options={LANGUAGES} value={language} setValue={setLanguage} />
            </Card>
            <Card title="Theme">
              <Dropdown options={THEMES} value={theme} setValue={setTheme} />
            </Card>
            <Card title="Preferred video quality">
              <Dropdown options={QUALITIES} value={quality} setValue={setQuality} />
            </Card>
            <Card title="Playback">
              <div className="flex flex-col gap-4">
                <ToggleRow label="Autoplay next episode" checked={autoplay} onChange={setAutoplay} />
                <ToggleRow label="Enable subtitles by default" checked={subtitles} onChange={setSubtitles} />
                <ToggleRow label="New content notifications" checked={notifications} onChange={setNotifications} />
              </div>
            </Card>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
            >
              <Save size={18} /> {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

/* ---------------- Reusable UI ---------------- */
function Card({ title, children }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5">
      <div className="text-zinc-300 font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-zinc-200 font-medium truncate" title={label}>{label}</div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ${checked ? "bg-cyan-500" : "bg-zinc-700"}`}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Dropdown({ options, value, setValue }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = useMemo(() => options.find((o) => o.value === value)?.label || "Select", [options, value]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700 shadow hover:border-cyan-500 focus:border-cyan-500 focus:outline-none"
      >
        <span className="truncate" title={selected}>{selected}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 mt-2 z-20 bg-zinc-900 rounded-xl border border-zinc-700 shadow-lg overflow-hidden"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  setValue(opt.value);
                  setOpen(false);
                }}
                className={`px-5 py-2 cursor-pointer select-none transition-colors ${
                  value === opt.value ? "bg-cyan-700 text-white" : "hover:bg-zinc-800 hover:text-cyan-300"
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

export default SettingsPage;
