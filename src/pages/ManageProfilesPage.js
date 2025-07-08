import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";

function ManageProfilesPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to fetch profile:", error.message);
        return;
      }

      if (data) {
        setProfiles([{ name: data.username, image: data.avatar_url }]);
      }
    };

    fetchProfile();
  }, [user]);

  const handleClick = (name) => {
    const encodedName = encodeURIComponent(name);
    navigate(`/user/${encodedName}`);
  };

  const handleManualProfileCreation = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;

    if (!currentUser) return alert("Deloghează-te și loghează-te din nou.");

    const username = currentUser.user_metadata?.username || currentUser.email;
    const avatarUrl = `https://i.pravatar.cc/150?u=${currentUser.id}`;

    const { error } = await supabase.from("profiles").insert({
      user_id: currentUser.id,
      username,
      avatar_url: avatarUrl
    });

    if (error) {
  console.error("Eroare completă Supabase:", error);
  alert("❌ Nu s-a putut crea profilul. Verifică consola.");
} else {
  alert("✅ Profil creat cu succes");
  setProfiles([{ name: username, image: avatarUrl }]);
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-cyan-400 tracking-tight">
          Gestionează profilul tău
        </h1>

        {profiles.length === 0 && (
          <div className="text-center mb-6">
            <button
              onClick={handleManualProfileCreation}
              className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded text-white font-semibold"
            >
              Creează profil manual
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
          {profiles.map((profile) => (
            <div
              key={profile.name}
              onClick={() => handleClick(profile.name)}
              className="group cursor-pointer rounded-xl bg-zinc-800 hover:bg-zinc-700 transition duration-200 overflow-hidden shadow-md border border-zinc-700"
            >
              <div className="relative w-full aspect-[4/3] bg-zinc-700">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/edit-profile");
                  }}
                  className="absolute top-2 right-2 text-white bg-cyan-600 hover:bg-cyan-500 rounded-full p-2 shadow-md"
                >
                  <Pencil size={16} />
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="text-center text-lg font-semibold text-white group-hover:text-cyan-300">
                  {profile.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageProfilesPage;
