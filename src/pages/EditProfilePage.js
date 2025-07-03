import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";

function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username, avatar_url: avatarUrl })
      .eq("user_id", user.id);

    if (error) {
      setMessage({ type: "error", text: "Eroare la salvare: " + error.message });
    } else {
      setMessage({ type: "success", text: "Profil actualizat!" });
      setTimeout(() => navigate("/manage-profiles"), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 rounded-2xl p-10 shadow-2xl">
        <div className="flex flex-col items-center gap-6">
          <img
            src={avatarUrl || `https://i.pravatar.cc/150?u=${user?.id}`}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-md transition-transform hover:scale-105"
          />

          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nume de utilizator</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">URL Avatar (opțional)</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded font-semibold transition ${
              loading ? "bg-cyan-700 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {loading ? "Se salvează..." : "Salvează modificările"}
          </button>

          {message && (
            <p
              className={`text-sm ${
                message.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;
