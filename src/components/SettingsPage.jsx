import React, { useState } from "react";

export function SettingsPage() {
  const [language, setLanguage] = useState("ro");
  const [quality, setQuality] = useState("auto");
  const [subtitles, setSubtitles] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(false);
  const [profileLock, setProfileLock] = useState(false);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-zinc-800 text-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold">Setări cont avansate</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Limba interfeței</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-zinc-700 text-white p-2 rounded"
          >
            <option value="ro">Română</option>
            <option value="en">Engleză</option>
            <option value="de">Germană</option>
            <option value="fr">Franceză</option>
            <option value="it">Italiană</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Calitate Video implicită</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full bg-zinc-700 text-white p-2 rounded"
          >
            <option value="auto">Auto</option>
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4k">4K</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={subtitles}
            onChange={() => setSubtitles(!subtitles)}
          />
          <label className="font-semibold">Activează subtitrări implicite</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={autoplay}
            onChange={() => setAutoplay(!autoplay)}
          />
          <label className="font-semibold">Redare automată a episoadelor următoare</label>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Temă aplicație</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-zinc-700 text-white p-2 rounded"
          >
            <option value="dark">Întunecată</option>
            <option value="light">Luminoasă</option>
            <option value="system">Automată (sistem)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          <label className="font-semibold">Permite notificări despre conținut nou</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={profileLock}
            onChange={() => setProfileLock(!profileLock)}
          />
          <label className="font-semibold">Blochează acest profil cu parolă</label>
        </div>
      </div>

      <button className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded mt-4">
        Salvează setările
      </button>
    </div>
  );
}