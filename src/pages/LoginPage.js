// LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
      <form onSubmit={handleLogin} className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold">Autentificare</h2>
        <input
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white placeholder-zinc-400"
        />
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded transition"
        >
          Intră în cont
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
