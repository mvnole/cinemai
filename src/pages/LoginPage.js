import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetRequested, setResetRequested] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Completează toate câmpurile.");
      return;
    }

    try {
      await login(email, password);
      navigate("/"); // redirecționează la homepage
    } catch (err) {
      alert("Eroare la autentificare: " + err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Introdu adresa de email pentru resetare.");
      return;
    }

    try {
      const { supabase } = await import("../utils/supabaseClient");
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      setResetRequested(true);
    } catch (error) {
      alert("Eroare la trimiterea emailului: " + error.message);
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: "url('/backgrounds/cinemai-register.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-0" />

      <form onSubmit={handleLogin} className="relative z-10 bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-white">Autentificare</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white placeholder-zinc-400"
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white placeholder-zinc-400"
        />
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded transition"
        >
          Intră în cont
        </button>

        <button
          type="button"
          onClick={handlePasswordReset}
          className="text-sm text-cyan-400 hover:underline mt-2"
        >
          Ai uitat parola?
        </button>
        {resetRequested && (
          <p className="text-green-400 text-sm mt-2">Email de resetare trimis. Verifică-ți inboxul.</p>
        )}
      </form>
    </div>
  );
}

export default LoginPage;