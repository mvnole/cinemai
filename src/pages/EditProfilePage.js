import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";
import { Pencil, X } from "lucide-react";

function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { id: profileId } = useParams();
  const [profileName, setProfileName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [showAvatarInput, setShowAvatarInput] = useState(false);

  useEffect(() => {
    if (user === undefined || !profileId) return;
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, user_id")
        .eq("id", profileId)
        .single();

      if (error || !data) {
        setMessage({ type: "error", text: "Acest profil nu există!" });
        setTimeout(() => navigate("/manage-profiles"), 1500);
        return;
      }
      if (data.user_id !== user.id) {
        setMessage({ type: "error", text: "Nu poți edita un profil care nu-ți aparține!" });
        setTimeout(() => navigate("/manage-profiles"), 1500);
        return;
      }
      setProfileName(data.name);
      setAvatarUrl(data.avatar_url);
      setMessage(null);
    };

    fetchProfile();
    // eslint-disable-next-line
  }, [profileId, user, navigate]);

  const handleSave = async () => {
    if (!profileId) return;
    setLoading(true);

    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .update({ name: profileName, avatar_url: avatarUrl })
      .eq("id", profileId)
      .select()
      .single();

    if (profileError) {
      setMessage({ type: "error", text: "Eroare la salvare profil: " + profileError.message });
      setLoading(false);
      return;
    }

    setMessage({ type: "success", text: "Profil actualizat!" });
    setLoading(false);

    setTimeout(() => navigate("/manage-profiles"), 1200);
  };

  const handleDelete = async () => {
    if (!window.confirm("Sigur vrei să ștergi acest profil?")) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").delete().eq("id", profileId);
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: "Eroare la ștergere: " + error.message });
      return;
    }
    setMessage({ type: "success", text: "Profil șters!" });
    setTimeout(() => navigate("/manage-profiles"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#161922] via-black to-[#181b23] flex items-center justify-center px-4 py-10">
      <form
        className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl bg-gradient-to-br from-zinc-900/85 via-zinc-950/90 to-black/90 border border-zinc-800/40 backdrop-blur-xl p-4 md:p-12 flex flex-col gap-0"
        onSubmit={e => { e.preventDefault(); handleSave(); }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 tracking-tight drop-shadow-xl">Manage Profile</h2>
        <div className="flex flex-col md:flex-row gap-10 md:gap-4 items-start w-full justify-between">
          {/* LEFT: Inputs */}
          <div className="flex-1 flex flex-col gap-7 w-full">
            {/* PROFILE NAME */}
            <div>
              <label className="block text-lg font-bold text-zinc-200 mb-2 pl-1">Profile Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={profileName}
                  maxLength={32}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 transition shadow pr-14"
                  placeholder="Profile name"
                  autoComplete="off"
                  required
                />
                {profileName.length > 0 && (
                  <button
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/80 transition"
                    type="button"
                    onClick={() => setProfileName("")}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            {/* CONTENT PREFERENCES */}
            <div>
              <h4 className="text-base font-bold mb-3 text-zinc-300">Content Preferences</h4>
              <div className="flex flex-row items-center justify-between rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/60 shadow px-6 py-4">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-zinc-200">
                    Ratings
                    <span className="ml-2 flex items-center justify-center rounded bg-zinc-800/70 px-2 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">18</span>
                  </div>
                  <div className="text-zinc-400 text-sm mt-1">The default ratings may not be suitable for all kids.</div>
                </div>
              </div>
            </div>
            {/* PROFILE SETTINGS */}
            <div>
              <h4 className="text-base font-bold mb-3 text-zinc-300">Profile Settings</h4>
              <div className="flex flex-row items-center justify-between rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/60 shadow px-6 py-4">
                <div>
                  <div className="font-semibold text-zinc-200">Lock Profile</div>
                  <div className="text-zinc-400 text-sm mt-1">Require a Profile PIN to enter this profile.</div>
                </div>
                {/* Dummy Switch, pentru demo, nu logic reală */}
                <div className="inline-flex items-center cursor-pointer ml-2">
                  <div className="w-11 h-6 bg-zinc-700 rounded-full relative transition">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow"></div>
                  </div>
                </div>
              </div>
              {/* LANGUAGE */}
              <div className="flex flex-row items-center justify-between rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/60 shadow px-6 py-4 mt-4">
                <div className="font-semibold text-zinc-200">Display Language</div>
                <div className="text-white font-medium">English (US)</div>
              </div>
            </div>
          </div>
          {/* RIGHT: AVATAR */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <div className="relative group">
              <div className="absolute -inset-2 blur-xl bg-cyan-400/20 rounded-full pointer-events-none group-hover:scale-105 group-hover:opacity-70 transition"></div>
              <img
                src={avatarUrl || `https://i.pravatar.cc/150?u=${profileId}`}
                alt="avatar"
                className="w-44 h-44 rounded-full object-cover border-4 border-cyan-400 shadow-xl bg-zinc-900 transition-transform group-hover:scale-105"
                onError={e => { e.currentTarget.src = "/default-avatar.png"; }}
              />
              {/* Edit Avatar Button */}
              <button
                type="button"
                className="absolute bottom-3 right-3 bg-zinc-900/80 hover:bg-cyan-500 text-white rounded-full p-3 shadow-lg border border-zinc-800/70 transition-all duration-200"
                onClick={() => setShowAvatarInput(v => !v)}
                tabIndex={-1}
                title="Schimbă avatarul"
              >
                <Pencil size={22} />
              </button>
            </div>
            {/* Show avatar URL input on button click */}
            {showAvatarInput && (
              <input
                type="text"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-64 px-4 py-2 mt-2 rounded-xl bg-zinc-800/90 border border-cyan-500 text-white text-base focus:outline-none focus:ring-2 focus:ring-cyan-400 transition shadow"
                placeholder="URL imagine avatar"
                autoFocus
              />
            )}
          </div>
        </div>
        {/* Footer Buttons */}
        <div className="flex flex-row gap-4 mt-14 mb-2 w-full items-center justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="px-10 py-3 rounded-xl font-semibold text-lg bg-zinc-200 text-black shadow hover:bg-white transition"
            disabled={loading}
          >
            Done
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-10 py-3 rounded-xl font-semibold text-lg bg-red-500 text-white shadow hover:bg-red-600 transition"
            disabled={loading}
          >
            Delete Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;
