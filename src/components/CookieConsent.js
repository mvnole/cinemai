import React, { useState, useEffect } from "react";
import { ShieldCheck, BarChart2, Megaphone } from "lucide-react";
import { useUser } from "../context/UserContext"; // <-- context user
import { supabase } from "../utils/supabaseClient"; // <-- client db

// Categoriile de cookies (poți adăuga sau modifica aici)
export const COOKIE_CATEGORIES = {
  necessary: {
    label: "Strict necesari",
    icon: <ShieldCheck className="inline w-5 h-5 mr-1 text-cyan-400" />,
    description: "Necesari pentru funcționarea corectă a site-ului. Nu pot fi dezactivați.",
    enabled: true,
    required: true,
  },
  analytics: {
    label: "Analytics",
    icon: <BarChart2 className="inline w-5 h-5 mr-1 text-cyan-400" />,
    description: "Ne ajută să înțelegem cum este folosit site-ul (ex: Google Analytics).",
    enabled: false,
    required: false,
  },
  marketing: {
    label: "Marketing",
    icon: <Megaphone className="inline w-5 h-5 mr-1 text-cyan-400" />,
    description: "Folosiți pentru reclame personalizate și urmărirea pe alte site-uri.",
    enabled: false,
    required: false,
  },
};

// Helper pt citit localStorage
export function getInitialConsent() {
  const saved = localStorage.getItem("cinemai_cookie_preferences");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

// Functie universala: salveaza in localStorage, cookie (12 luni) si optional in DB
export async function saveCookiePrefs(prefs, saveToSupabase) {
  // 1. localStorage
  localStorage.setItem("cinemai_cookie_preferences", JSON.stringify(prefs));

  // 2. Cookie browser cu expirare 12 luni
  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + 12);
  document.cookie = `cinemai_cookie_preferences=${encodeURIComponent(JSON.stringify(prefs))}; path=/; expires=${expDate.toUTCString()}`;

  // 3. DB daca e user logat si ai functia
  if (saveToSupabase) {
    await saveToSupabase(prefs);
  }

  // Event custom pentru update global UI
  window.dispatchEvent(new Event("cookie-preference-updated"));
}

// --------- Bannerul principal (apare jos prima data) ----------
export function CookieConsentBanner({
  onPreferencesOpen,
  saveToSupabase,
  saveCookiePrefs: externalSave // din App, handler universal
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getInitialConsent();
    setShow(!consent);
  }, []);

  if (!show) return null;

  // Folosim handler universal pentru a salva preferințele
  function handleAcceptAll() {
    const full = {};
    for (const key in COOKIE_CATEGORIES) full[key] = true;
    if (externalSave) externalSave(full);
    setShow(false);
  }
  function handleStrict() {
    const strict = {};
    for (const key in COOKIE_CATEGORIES)
      strict[key] = COOKIE_CATEGORIES[key].required;
    if (externalSave) externalSave(strict);
    setShow(false);
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-[99999]">
      <div className="max-w-2xl mx-auto my-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900/90 border border-cyan-800 shadow-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 ring-2 ring-cyan-700/20 backdrop-blur">
        <span className="text-base text-zinc-100 flex-1">
          Folosim cookies pentru o experiență mai bună.{" "}
          <button
            className="underline text-cyan-400 hover:text-cyan-300 font-semibold"
            onClick={onPreferencesOpen}
          >
            Setează preferințe
          </button>
          .
        </span>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <button
            onClick={handleAcceptAll}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-md transition"
          >
            Acceptă tot
          </button>
          <button
            onClick={handleStrict}
            className="bg-zinc-700 hover:bg-zinc-600 text-gray-200 px-5 py-2 rounded-xl font-semibold text-sm transition"
          >
            Doar strict necesari
          </button>
          <button
            onClick={onPreferencesOpen}
            className="bg-zinc-800 hover:bg-zinc-700 text-cyan-300 px-5 py-2 rounded-xl font-semibold text-sm border border-cyan-900 transition"
          >
            Setează preferințe
          </button>
        </div>
      </div>
    </div>
  );
}

// --------- Modalul cu preferințele detaliate -----------
export function CookiePreferencesModal({
  open,
  onClose,
  saveToSupabase,
  saveCookiePrefs: externalSave // handler universal, din App
}) {
  const { user } = useUser();
  const [prefs, setPrefs] = useState(getInitialConsent() || {
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Resetare la deschidere (ca sa nu ramana succesul)
  useEffect(() => {
    if (open) setSuccess(false);
  }, [open]);

  // Schimbă preferință
  function handleChange(key) {
    if (COOKIE_CATEGORIES[key].required) return;
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Save centralizat (local, cookie, db)
  async function handleSave() {
    setLoading(true);
    setSuccess(false);
    if (externalSave) await externalSave(prefs);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 800);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-2">
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900/80 rounded-3xl shadow-2xl max-w-md w-full p-7 border border-cyan-900 relative ring-2 ring-cyan-700/30">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" />
          Setează preferințele de cookies
        </h2>
        <form>
          {Object.entries(COOKIE_CATEGORIES).map(([key, cat]) => (
            <div
              key={key}
              className={`flex items-start mb-4 bg-zinc-800/80 rounded-xl px-3 py-2 ${cat.required ? "opacity-70" : ""}`}
            >
              <input
                type="checkbox"
                checked={!!prefs[key]}
                disabled={cat.required}
                onChange={() => handleChange(key)}
                className="mt-1 mr-3 accent-cyan-500 scale-125"
                id={`cookie-cat-${key}`}
              />
              <label htmlFor={`cookie-cat-${key}`} className="flex-1 select-none">
                <span className="font-semibold text-zinc-100 flex items-center gap-2">
                  {cat.icon}
                  {cat.label}
                  {cat.required && (
                    <span className="ml-2 text-xs bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded font-normal">
                      obligatoriu
                    </span>
                  )}
                </span>
                <div className="text-zinc-400 text-xs mt-1">{cat.description}</div>
              </label>
            </div>
          ))}
        </form>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-6 py-2 rounded-lg text-sm bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            onClick={onClose}
            disabled={loading}
          >
            Renunță
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-lg text-sm bg-cyan-500 text-white hover:bg-cyan-400 shadow font-semibold flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-wait" : ""}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5 mr-1" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : null}
            {success ? "Salvat!" : "Salvează preferințele"}
          </button>
        </div>
        <button
          className="absolute top-4 right-5 text-zinc-500 hover:text-cyan-400 transition"
          onClick={onClose}
          type="button"
          aria-label="Închide"
        >
          <svg width={24} height={24} viewBox="0 0 24 24">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Helper pentru a prelua preferința unei categorii
export function getCookieConsent(category) {
  const saved = getInitialConsent();
  return saved?.[category];
}
