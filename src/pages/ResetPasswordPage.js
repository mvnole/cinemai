import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [canReset, setCanReset] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function checkRecovery() {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      // *** MODIFICARE: DOAR ACCESS_TOKEN ***
      if (params.get("access_token")) {
        setCanReset(true);
        setMessage("");
      } else {
        setCanReset(false);
        setMessage("Link invalid sau expirat.");
      }
    }
    checkRecovery();
    window.addEventListener("hashchange", checkRecovery);
    return () => window.removeEventListener("hashchange", checkRecovery);
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (!password || password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else {
      setMessage("Parola a fost resetată cu succes! Vei fi redirecționat...");
      setTimeout(() => navigate("/login"), 2500);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img
          src="/backgrounds/background.png"
          alt="cinemai-background"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.7) blur(0.5px)" }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div
        className="relative z-10 w-full max-w-lg rounded-3xl shadow-xl p-10 flex flex-col items-center"
        style={{
          background:
            "linear-gradient(120deg,rgba(18,24,36,0.32) 70%,rgba(39,200,245,0.08) 100%)",
          boxShadow: "0 6px 36px 0 #0006, 0 1.5px 8px 0 #0ff2",
          border: "1px solid rgba(34,211,238,0.13)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <img
          src="/logo-cinemai.png"
          alt="CinemAI Logo"
          className="w-16 h-16 mb-3 drop-shadow-xl rounded-full border-2 border-cyan-400 bg-white/10"
        />
        <h1 className="text-2xl font-bold mb-4 text-white">Setează o parolă nouă</h1>
        {!canReset ? (
          <div className="text-red-500">{message}</div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 w-full">
            <input
              type="password"
              placeholder="Noua parolă"
              className="w-full p-2 rounded bg-zinc-800 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-500">
              Schimbă parola
            </button>
          </form>
        )}
        {message && canReset && <div className="text-green-400 mt-4">{message}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}
