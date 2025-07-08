import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

// Input component ca la register
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

function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetRequested, setResetRequested] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();
  const { login } = useUser();

  // Ascunde header-ul când intri pe login
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "";
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      alert("Complete all fields.");
      return;
    }

    try {
      // Folosim emailOrUsername direct, fie email, fie username
      // Dacă vrei să faci un lookup username->email, trebuie alt backend logic
      await login(emailOrUsername, password);

      if (!rememberMe) {
        // Mută sesiunea în sessionStorage ca să expire la închiderea tabului
        const session = localStorage.getItem("supabase.auth.token");
        if (session) {
          sessionStorage.setItem("supabase.auth.token", session);
          localStorage.removeItem("supabase.auth.token");
        }
      }
      
      navigate("/");
    } catch (err) {
      alert("Login error: " + err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!emailOrUsername) {
      alert("Enter your email for reset.");
      return;
    }
    try {
      const { supabase } = await import("../utils/supabaseClient");
      await supabase.auth.resetPasswordForEmail(emailOrUsername, {
        redirectTo: window.location.origin + "/reset-password",
      });
      setResetRequested(true);
    } catch (error) {
      alert("Password reset error: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* FUNDAL CU FILMCARDS BLURATE */}
      <div className="fixed inset-0 z-0">
        <img
          src="/backgrounds/background.png"
          alt="cinemai-background"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.7) blur(0.5px)" }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* CARD CENTRAL AERO */}
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
        <div className="text-cyan-300 font-bold text-xl mb-1 tracking-wide text-center">
          Welcome back to CinemAI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 text-center drop-shadow-cyan">
          Sign in to your account
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <Input
            icon={<FaEnvelope />}
            type="text"
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm text-gray-300 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded"
            />
            Remember me
          </label>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px #0ff9" }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-2 px-4 rounded-xl font-bold text-lg transition focus:outline-none shadow-cyan-400/30 shadow bg-cyan-500 hover:bg-cyan-400 focus:ring-2 focus:ring-cyan-400/40 active:bg-cyan-600"
          >
            Sign In
          </motion.button>
        </form>

        <button
          type="button"
          onClick={handlePasswordReset}
          className="text-sm text-cyan-300 hover:underline mt-4 transition"
        >
          Forgot password?
        </button>
        {resetRequested && (
          <p className="text-green-400 text-sm mt-2">
            Reset email sent. Check your inbox.
          </p>
        )}

        <p className="mt-8 text-center text-sm text-zinc-300">
          Don't have an account?{" "}
          <a href="/register" className="text-cyan-300 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
