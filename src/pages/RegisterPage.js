import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// ---- Gender Dropdown Custom ----
function GenderDropdown({ value, setValue }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const options = [
    { value: "male", label: "Male", color: "text-cyan-300" },
    { value: "female", label: "Female", color: "text-pink-300" },
    { value: "other", label: "Other", color: "text-yellow-300" }
  ];
  const selected = options.find(opt => opt.value === value);
  return (
    <div ref={ref} className="relative z-30">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center w-full bg-zinc-800/90 px-3 py-2 rounded-lg ring-1 ring-zinc-700 focus:ring-2 focus:ring-cyan-400 transition-all shadow"
      >
        <svg className="text-xl mr-3 text-cyan-300" width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M11.5 2.5v4m0 0H13a4.5 4.5 0 010 9H8A4.5 4.5 0 018 6.5h1.5z" stroke="#67e8f9" strokeWidth="1.5" />
        </svg>
        <span className={selected?.color || "text-zinc-300"}>
          {selected ? selected.label : "Gender"}
        </span>
        <svg className={`w-4 h-4 ml-auto transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none">
          <path d="M6 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={() => {
                  setValue(opt.value);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-5 py-2 cursor-pointer transition 
                  ${value === opt.value ? "bg-cyan-700/60 text-white" : "hover:bg-zinc-800"} ${opt.color}`}
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

// ---- Date Input cu efect glow la focus ----
function DateInput({ value, onChange }) {
  const inputRef = useRef();
  return (
    <div className="flex items-center bg-zinc-800/90 rounded-lg px-3 py-2 ring-1 ring-zinc-700 focus-within:ring-2 focus-within:ring-cyan-400 transition-all shadow">
      <svg className="text-cyan-300 text-xl mr-3" width="20" height="20" fill="none"><path d="M4 4h12v12H4V4zm1 2v8h10V6H5zm2 2h2v2H7V8zm0 4h2v2H7v-2zm4-4h2v2h-2V8zm0 4h2v2h-2v-2z" stroke="#67e8f9" strokeWidth="1.5" /></svg>
      <input
        type="date"
        value={value}
        onChange={onChange}
        ref={inputRef}
        className="bg-transparent outline-none border-none text-white placeholder-zinc-400 flex-1 py-1"
        required
        style={{
          boxShadow: "0 0 0 0 rgba(0,255,255,0.2)",
          transition: "box-shadow 0.2s"
        }}
        onFocus={e => e.target.style.boxShadow = "0 0 12px 2px #22d3ee55"}
        onBlur={e => e.target.style.boxShadow = "0 0 0 0 rgba(0,255,255,0.2)"}
      />
    </div>
  );
}

// ---- Input cu icon la stânga ----
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
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Inserare profile după confirmarea userului (opțional, doar dacă vrei)
  useEffect(() => {
    if (!user?.id) return;
    const addProfile = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      if (prof) return;
      const meta = user.user_metadata || {};
      const now = new Date().toISOString();
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        username: meta.username || "",
        full_name: meta.fullName || "",
        birth_date: meta.birthDate || "",
        gender: meta.gender || "",
        accepted_privacy: true,
        accepted_privacy_at: now,
        accepted_terms: true,
        accepted_terms_at: now,
      });
    };
    addProfile();
  }, [user]);

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

    // Validare minim 16 ani
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear() - (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0
    );
    if (age < 16) {
      alert("You must be at least 16 years old to register.");
      return;
    }

    if (!fullName || !username || !email || !password || !confirmPassword || !birthDate || !gender) {
      alert("Complete all fields.");
      return;
    }
    if (!acceptedPrivacy) {
      alert("You must accept the Privacy Policy to register.");
      return;
    }
    if (!acceptedTerms) {
      alert("You must accept the Terms & Conditions to register.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register(email, password, {
        fullName,
        username,
        birthDate,
        gender,
        accepted_privacy: true,
        accepted_privacy_at: new Date().toISOString(),
        accepted_terms: true,
        accepted_terms_at: new Date().toISOString(),
      });
      alert("Account created! Check your email for confirmation.");
    } catch (error) {
      alert("Registration error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Fundal cinematic */}
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
        className="relative z-10 w-full max-w-lg
    bg-white/10 backdrop-blur-2xl
    border border-cyan-300/20
    rounded-3xl shadow-xl p-10 flex flex-col items-center"
        style={{
          background:
            "linear-gradient(120deg,rgba(18,24,36,0.32) 70%,rgba(39,200,245,0.08) 100%)",
          boxShadow:
            "0 6px 36px 0 #0006, 0 1.5px 8px 0 #0ff2",
          border: "1px solid rgba(34,211,238,0.13)"
        }}
      >
        {/* Logo + tagline */}
        <img
          src="/logo-cinemai.png"
          alt="CinemAI Logo"
          className="w-20 h-20 mb-3 drop-shadow-xl rounded-full border-2 border-cyan-400 bg-white/10"
        />
        <div className="text-cyan-300 font-bold text-xl mb-1 tracking-wide text-center">Unlock the Future of Film</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 text-center drop-shadow-cyan">
          Create your CinemAI Account
        </h1>
        <form className="space-y-4 w-full" onSubmit={handleSubmit} autoComplete="off">
          <Input icon={<FaUser />} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
          <Input icon={<FaUser />} name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
          <Input icon={<FaEnvelope />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
          <Input icon={<FaLock />} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          <Input icon={<FaLock />} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
          <DateInput value={formData.birthDate} onChange={e => setFormData(f => ({ ...f, birthDate: e.target.value }))} />
          <GenderDropdown value={formData.gender} setValue={v => setFormData(f => ({ ...f, gender: v }))} />

          {/* Checkbox Privacy Policy */}
          <div className="flex items-center gap-2 mt-2">
            <input
              id="privacy"
              type="checkbox"
              checked={acceptedPrivacy}
              onChange={e => setAcceptedPrivacy(e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
              required
            />
            <label htmlFor="privacy" className="text-sm text-zinc-200">
              I accept the{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-cyan-300 hover:text-cyan-400">Privacy Policy</a>
            </label>
          </div>
          {/* Checkbox Terms & Conditions */}
          <div className="flex items-center gap-2 -mt-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={e => setAcceptedTerms(e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
              required
            />
            <label htmlFor="terms" className="text-sm text-zinc-200">
              I accept the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-cyan-300 hover:text-cyan-400">Terms & Conditions</a>
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px #0ff9" }}
            whileTap={{ scale: 0.98 }}
            className={`w-full mt-2 py-2 px-4 rounded-xl font-bold text-lg transition focus:outline-none shadow-cyan-400/30 shadow
            ${loading ? "bg-cyan-800 cursor-not-allowed opacity-70" : "bg-cyan-500 hover:bg-cyan-400 focus:ring-2 focus:ring-cyan-400/40 active:bg-cyan-600"}
            `}
          >
            {loading ? "Creating Account..." : "Register"}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-300">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-300 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
