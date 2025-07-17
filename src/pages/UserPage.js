import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { User, ShieldCheck, Monitor, Users } from "lucide-react";

const menu = [
  { label: "General", icon: <User size={22} />, key: "general" },
  { label: "Securitate", icon: <ShieldCheck size={22} />, key: "security" },
  { label: "Dispozitive", icon: <Monitor size={22} />, key: "devices" },
  { label: "Profile", icon: <Users size={22} />, key: "profiles" },
];

export default function UserPage() {
  const { user } = useUser();
  const [active, setActive] = useState("general");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        <div className="text-white text-center text-2xl font-bold bg-zinc-900/70 px-8 py-10 rounded-2xl shadow-xl border border-zinc-800/70 backdrop-blur-xl">
          Trebuie să fii autentificat pentru a vedea această pagină.
        </div>
      </div>
    );
  }

  // Preferință: nume afișat = full_name -> username -> email
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.username ||
    user.email;

  // Preferință: avatar din user_metadata, apoi pravatar, apoi fallback
  const avatarSrc =
    user.user_metadata?.avatar_url ||
    `https://i.pravatar.cc/150?u=${user.id || user.email}`;

  // Rol și status
  const role = user.user_metadata?.role || user.role || "utilizator";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151820] via-[#13151b] to-[#181b23] flex flex-col items-center justify-center px-2 py-14">
      <div className="w-full max-w-5xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-2xl shadow-2xl rounded-3xl px-4 py-6 md:px-12 md:py-12 flex flex-col md:flex-row gap-10 transition">
        {/* Left menu */}
        <div className="flex flex-col items-center md:items-start gap-8 min-w-[170px] md:min-w-[220px]">
          <div className="relative group">
            <div className="absolute -inset-2 blur-xl bg-cyan-400/20 rounded-full pointer-events-none group-hover:scale-110 group-hover:opacity-80 transition-all duration-300"></div>
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-cyan-400 shadow-xl bg-zinc-900 transition-transform group-hover:scale-105"
              onError={e => { e.currentTarget.src = "/default-avatar.png"; }}
            />
          </div>
          <nav className="w-full flex flex-col gap-2 mt-3">
            {menu.map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-lg w-full transition-all
                  ${active === item.key
                    ? "bg-cyan-500/90 text-white shadow ring-2 ring-cyan-400"
                    : "bg-zinc-800/60 text-zinc-300 hover:bg-cyan-900/40 hover:text-cyan-300"}`}
                onClick={() => setActive(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Content Panel */}
        <div className="flex-1 w-full">
          <div className="bg-zinc-900/70 rounded-2xl border border-zinc-800/60 px-8 py-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-cyan-300 mb-4 drop-shadow-xl">
              {active === "general" && "Detalii cont"}
              {active === "security" && "Securitate"}
              {active === "devices" && "Dispozitive"}
              {active === "profiles" && "Profile"}
            </h2>
            {active === "general" ? (
              <div className="space-y-3">
                <div>
                  <span className="text-zinc-400 font-medium mr-2">Nume:</span>
                  <span className="text-white font-semibold">{displayName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium mr-2">Email:</span>
                  <span className="text-cyan-400 font-semibold">{user.email}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium mr-2">Rol:</span>
                  <span className="text-cyan-400 font-semibold">{role}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium mr-2">Status:</span>
                  <span className="text-green-400 font-semibold">Activ</span>
                </div>
                <button
                  className="mt-6 px-7 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-base font-bold shadow transition"
                >
                  Modifică detaliile
                </button>
              </div>
            ) : active === "security" ? (
              <div className="space-y-3">
                <div className="text-zinc-400">Setări de securitate (în lucru)</div>
              </div>
            ) : active === "devices" ? (
              <div className="space-y-3">
                <div className="text-zinc-400">Dispozitive conectate (în lucru)</div>
              </div>
            ) : active === "profiles" ? (
              <div className="space-y-3">
                <div className="text-zinc-400">Administrare profile (în lucru)</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
