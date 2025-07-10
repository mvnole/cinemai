// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

// Reuse Input component from ForgotPasswordPage (or extract to shared)
function Input({ icon, ...props }) {
  return (
    <div className="flex items-center bg-zinc-800/90 rounded-lg px-3 py-2 ring-1 ring-zinc-700 focus-within:ring-2 focus-within:ring-cyan-400 transition-all shadow">
      <span className="text-cyan-300 text-xl mr-3">{icon}</span>
      <input
        {...props}
        className="bg-transparent outline-none border-none text-white placeholder-zinc-400 flex-1 py-1"
        autoComplete="off"
        required
      />
    </div>
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [canReset, setCanReset] = useState(false);
  const navigate = useNavigate();

  // Hide header
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "";
    };
  }, []);

  // Check session
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setCanReset(true);
      else setMessage("Link invalid sau expirat.");
      setLoading(false);
    })();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    if (updateErr) setError(updateErr.message);
    else {
      setMessage("Parola resetată cu succes! Redirect la login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  if (loading) return <div className="text-center py-12 text-white">Se încarcă…</div>;
  if (!canReset) return <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">{message}</div>;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src="/backgrounds/background.png"
          alt="cinemai-background"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.7) blur(0.5px)" }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Central Card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-3xl shadow-xl p-10 flex flex-col items-center"
        style={{
          background: "linear-gradient(120deg,rgba(18,24,36,0.32) 70%,rgba(39,200,245,0.08) 100%)",
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
        <h2 className="text-2xl font-bold text-white mb-6">Setează o parolă nouă</h2>

        <form onSubmit={handleReset} className="w-full space-y-4">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Noua parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-400 transition shadow-cyan-400/30"
          >
            Resetează parola
          </motion.button>
        </form>

        {error   && <div className="mt-4 text-red-400 text-center">{error}</div>}
        {message && <div className="mt-4 text-green-300 text-center">{message}</div>}

        <Link to="/login" className="mt-6 text-sm text-cyan-300 hover:underline">
          Înapoi la autentificare
        </Link>
      </div>
    </div>
  );
}
