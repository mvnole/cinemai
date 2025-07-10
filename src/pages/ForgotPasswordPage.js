import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (!email) {
      setError("Te rog introdu emailul!");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) setError(error.message);
    else setMessage("Ți-am trimis un email cu link de resetare a parolei!");
  };

  return (
    <div className="max-w-sm mx-auto my-12 bg-zinc-900 rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Recuperează parola</h1>
      <form onSubmit={handleForgot} className="space-y-4">
        <input
          type="email"
          placeholder="Emailul tău"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-500"
        >
          Trimite email de resetare
        </button>
      </form>
      {message && <div className="text-green-400 mt-4">{message}</div>}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}
