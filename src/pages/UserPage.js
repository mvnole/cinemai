import React from "react";
import { useUser } from "../context/UserContext";
import { User, ShieldCheck, Monitor, Users } from "lucide-react";

const UserPage = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-white text-center mt-20 text-xl">
        Trebuie să fii autentificat pentru a vedea această pagină.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 text-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">
        Contul utilizatorului {user.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col gap-4">
          <button className="flex items-center gap-2 text-left text-sm hover:text-cyan-400">
            <User size={18} /> General
          </button>
          <button className="flex items-center gap-2 text-left text-sm hover:text-cyan-400">
            <ShieldCheck size={18} /> Securitate
          </button>
          <button className="flex items-center gap-2 text-left text-sm hover:text-cyan-400">
            <Monitor size={18} /> Dispozitive
          </button>
          <button className="flex items-center gap-2 text-left text-sm hover:text-cyan-400">
            <Users size={18} /> Profile
          </button>
        </div>

        <div className="md:col-span-3">
          <div className="bg-zinc-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Detalii cont</h2>
            <p className="mb-2">Nume: <span className="text-cyan-400">{user.name}</span></p>
            <p className="mb-2">Email: <span className="text-cyan-400">{user.email}</span></p>
            <p className="mb-2">Rol: <span className="text-cyan-400">{user.role}</span></p>
            <p className="mb-2">Status: <span className="text-cyan-400">Activ</span></p>

            <div className="mt-4">
              <button className="text-sm text-blue-400 hover:underline">Modifică detaliile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
