import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useUser();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "";
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session && data.session.user.confirmed_at) {
        navigate("/subscription");
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.confirmed_at) {
        navigate("/subscription");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password, confirmPassword, birthDate, gender } = formData;

    if (!fullName || !username || !email || !password || !confirmPassword || !birthDate || !gender) {
      alert("Completează toate câmpurile.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Parolele nu coincid.");
      return;
    }

    try {
      setLoading(true);
      await register(email, password, {
        fullName,
        username,
        birthDate,
        gender
      });
      alert("Cont creat! Verifică-ți emailul pentru confirmare.");
    } catch (error) {
      alert("Eroare la înregistrare: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: "url('/backgrounds/cinemai-register.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-0" />

      <div className="relative z-10 bg-zinc-900 bg-opacity-90 p-10 rounded-lg max-w-md w-full text-white shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Creează-ți contul CinemAI
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <input type="text" name="fullName" placeholder="Nume complet" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none" required />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none" required />
            <input type="email" name="email" placeholder="Adresă email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none" required />
            <input type="password" name="password" placeholder="Parolă" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none" required />
            <input type="password" name="confirmPassword" placeholder="Confirmă parola" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none" required />
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none" required />
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none" required>
              <option value="">Gen</option>
              <option value="male">Masculin</option>
              <option value="female">Feminin</option>
              <option value="other">Altul</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className={`w-full py-2 px-4 rounded font-semibold transition ${loading ? "bg-cyan-700 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"}`}>
            {loading ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Ai deja un cont? <a href="/login" className="text-cyan-400 hover:underline">Autentifică-te</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
