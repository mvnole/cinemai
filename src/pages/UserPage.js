// pages/UserPage.js
import React from "react";
import { useParams } from "react-router-dom";
import { User, ShieldCheck, Monitor, Users } from "lucide-react";

const UserPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 text-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Contul utilizatorului {id}</h1>

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
            <h2 className="text-xl font-semibold mb-4">Detalii abonament</h2>
            <p className="mb-2">Plan: <span className="text-cyan-400">Premium</span></p>
            <p className="mb-2">Membru din: <span className="text-cyan-400">Aprilie 2025</span></p>
            <p className="mb-2">Următoarea plată: <span className="text-cyan-400">27 Iunie 2025</span></p>
            <p className="mb-2">Metodă de plată: <span className="text-cyan-400">Visa •••• 2615</span></p>

            <div className="mt-4">
              <button className="text-sm text-blue-400 hover:underline">Modifică abonamentul</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
