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
    if (user) {
      const currentName = user.user_metadata?.username || user.email;
      const avatarUrl = `https://i.pravatar.cc/100?u=${user.id}`;
      setProfiles([{ name: currentName, image: avatarUrl }]);
    }
  }, [user]);

  const handleClick = (name) => {
    const encodedName = encodeURIComponent(name);
    navigate(`/user/${encodedName}`);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Profiles</h1>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
          <div className="border-b border-zinc-700 p-4 text-sm text-zinc-300">
            Profile Settings
          </div>
          <ul>
            {profiles.map((profile) => (
              <li
                key={profile.name}
                onClick={() => handleClick(profile.name)}
                className="flex items-center justify-between px-4 py-3 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <span className="text-base">{profile.name}</span>
                </div>
                <button className="text-cyan-400 hover:text-cyan-300">
                  <Pencil size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ManageProfilesPage;
