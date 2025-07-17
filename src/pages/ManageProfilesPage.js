import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageProfilesPage() {
  const navigate = useNavigate();
  const { user, selectProfile } = useUser();
  const [profiles, setProfiles] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [curtainsClosing, setCurtainsClosing] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) {
        setProfiles([]);
        console.log("[ManageProfiles] User absent, profiles empty.");
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });
      if (error) {
        setProfiles([]);
        console.log("[ManageProfiles] Eroare la fetch profiles:", error);
      } else {
        setProfiles((data || []).filter(p => !!p && !!p.id));
        console.log("[ManageProfiles] Am incarcat profilele din DB:", data);
      }
    };
    fetchProfiles();
  }, [user]);

  const CLAP_WIDTH = "w-[270px]";
  const CLAP_HEIGHT = "h-[180px]";

  const list = { visible: { transition: { staggerChildren: 0.13 } } };
  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.39, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { opacity: 0, y: 25, transition: { duration: 0.16 } }
  };

  // Draperii
  const Draperies = (
    <>
      <motion.div
        initial={false}
        animate={curtainsClosing ? { left: 0 } : { left: "-51%" }}
        transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] }}
        className="fixed top-0 left-0 w-1/2 h-screen bg-gradient-to-br from-[#0d2230] via-[#08243c] to-[#0a1a25] z-[9999] pointer-events-none"
        style={{ borderRight: "3px solid #00bcd4", boxShadow: "6px 0 24px 0 #0af6" }}
      />
      <motion.div
        initial={false}
        animate={curtainsClosing ? { right: 0 } : { right: "-51%" }}
        transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] }}
        className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-[#0d2230] via-[#08243c] to-[#0a1a25] z-[9999] pointer-events-none"
        style={{ borderLeft: "3px solid #00bcd4", boxShadow: "-6px 0 24px 0 #0af6" }}
      />
    </>
  );

  // Handler cu efect de draperii + context
  const handleSelectProfile = (profile) => {
  setCurtainsClosing(true);
  console.log("[ManageProfiles] A selectat profilul:", profile);
  setTimeout(() => {
    selectProfile(profile.id); // <- trebuie să persiste și în localStorage!
    // DEBUG
    setTimeout(() => {
      console.log("[ManageProfiles] localStorage after select:", localStorage.getItem("activeProfileId"));
    }, 20);
    navigate("/", { state: { fromManageProfiles: true } });
  }, 900);
};

  const handleEditProfile = (e, profile) => {
    e.stopPropagation();
    console.log("[ManageProfiles] Edit profile click pentru:", profile);
    navigate(`/edit-profile/${profile.id}`);
  };

  const handleAddProfile = async () => {
    if (!Array.isArray(profiles) || profiles.length >= 3) {
      alert("Poți crea maximum 3 profile.");
      console.log("[ManageProfiles] Maxim profile atins.");
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;
    if (!currentUser) {
      alert("Deloghează-te și loghează-te din nou.");
      console.log("[ManageProfiles] Fara user la add profile!");
      return;
    }
    const newName = `Profile ${profiles.length + 1}`;
    const avatarUrl = `https://i.pravatar.cc/150?u=${currentUser.id}-${profiles.length + 1}`;
    const { data: dataArray, error } = await supabase
      .from("profiles")
      .insert({ user_id: currentUser.id, name: newName, avatar_url: avatarUrl })
      .select();
    const newProfile = Array.isArray(dataArray) ? dataArray[0] : null;
    if (error || !newProfile) {
      alert("❌ Nu s-a putut crea profilul.");
      console.log("[ManageProfiles] Eroare la crearea profilului:", error);
      return;
    }
    setProfiles((prev) => ([...(prev || []).filter(p => !!p && !!p.id), newProfile]));
    console.log("[ManageProfiles] Profil creat cu succes:", newProfile);
  };

  if (!user) {
    console.log("[ManageProfiles] Nu exista user (inca incarca?)");
    return <div className="text-white py-12">Se încarcă profilurile...</div>;
  }
  if (!Array.isArray(profiles)) {
    console.log("[ManageProfiles] Nu exista profiles (inca incarca?)");
    return <div className="text-white py-12">Se încarcă profilele...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14171e] via-black to-[#181b23] flex flex-col items-center justify-center relative">
      {Draperies}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white tracking-tight select-none drop-shadow-lg z-10 pt-6"></h1>
        <div className="h-12" />
        <motion.div
          className="w-full flex flex-wrap gap-10 justify-center"
          variants={list}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {(profiles || []).filter(p => !!p && !!p.id).map((profile, idx) => (
              <motion.div
                key={profile.id}
                variants={item}
                initial="hidden"
                animate="visible"
                exit="exit"
                tabIndex={0}
                onClick={() => handleSelectProfile(profile)}
                className="group cursor-pointer relative flex flex-col items-center select-none outline-none focus:ring-2 focus:ring-cyan-400 transition"
                style={{ zIndex: 10 - idx }}
              >
                {/* CLAPETA CONTAINER */}
                <motion.div
                  className={`relative ${CLAP_WIDTH} flex flex-col items-center`}
                  onMouseEnter={() => setHoveredId(profile.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Bara clapetei */}
                  <motion.div
                    className="absolute -top-10 left-0 w-full h-10 z-20 flex items-center border-b-4 border-black rounded-t-lg"
                    style={{
                      background: "linear-gradient(180deg, #182d34 80%, #0b1726 100%)",
                      boxShadow: "0 4px 16px 0 #02213bcc",
                      transformOrigin: "left bottom",
                    }}
                    animate={hoveredId === profile.id ? { rotate: -35 } : { rotate: 0 }}
                    transition={{ type: "spring", stiffness: 210, damping: 16 }}
                  >
                    <div className="flex flex-row h-10 items-center w-full overflow-hidden">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-10 w-[33px] ${i % 2 === 0 ? "bg-white" : "bg-black"} -skew-x-12`}
                        />
                      ))}
                    </div>
                  </motion.div>
                  {/* Corpul clapetei */}
                  <div className={`relative w-full ${CLAP_HEIGHT} bg-gradient-to-br from-[#124e63] via-[#15384a] to-[#0a1a25] rounded-b-lg border-[3px] border-black shadow-2xl flex flex-row items-center justify-between z-10 overflow-hidden px-4 pt-4 pb-4 text-white`}>
                    <div className="flex-shrink-0">
                      <img
                        src={profile.avatar_url || "/default-avatar.png"}
                        alt={profile.name}
                        className="w-14 h-14 rounded-md object-cover border-2 border-cyan-400 bg-zinc-900 shadow"
                        onError={e => { e.currentTarget.src = "/default-avatar.png"; }}
                      />
                    </div>
                    <div className="flex flex-col flex-grow ml-4 justify-center" style={{ fontFamily: '"Archivo", sans-serif' }}>
                      <div className="flex flex-row items-center mb-2">
                        <span className="text-base font-extrabold tracking-wide mr-2 text-white">PROD:</span>
                        <span className="text-base font-extrabold tracking-wide text-cyan-300 uppercase">CinemAI</span>
                      </div>
                      <div className="flex flex-row items-center">
                        <span className="text-base font-extrabold tracking-wide mr-2 text-white">PROFILE:</span>
                        <span className="text-base font-extrabold tracking-wide text-cyan-300">{profile.name}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <button
                  className="mt-2 w-9 h-9 rounded-full bg-black/90 flex items-center justify-center text-white shadow hover:bg-cyan-500 hover:text-white transition z-30 border border-white border-opacity-30"
                  onClick={e => handleEditProfile(e, profile)}
                  tabIndex={-1}
                  title="Editează profil"
                  style={{ fontSize: 18 }}
                >
                  <Pencil size={22} />
                </button>
              </motion.div>
            ))}

            {/* Add profile, clapeta clasică */}
            {Array.isArray(profiles) && profiles.length < 3 && (
              <motion.div
                key="add-profile"
                variants={item}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleAddProfile}
                className="group cursor-pointer flex flex-col items-center select-none"
                whileHover={{ scale: 1.09, rotate: -2 }}
              >
                <div className={`relative ${CLAP_WIDTH} ${CLAP_HEIGHT} flex flex-col items-center justify-center bg-gradient-to-br from-[#124e63] via-[#15384a] to-[#0a1a25] border-4 border-dashed border-cyan-400 rounded-lg shadow-2xl`}>
                  <motion.div
                    className="absolute -top-10 left-0 w-full h-10 z-20 flex items-center border-b-4 border-black rounded-t-lg"
                    style={{
                      background: "linear-gradient(180deg, #182d34 80%, #0b1726 100%)",
                      boxShadow: "0 4px 16px 0 #02213bcc",
                      transformOrigin: "left bottom",
                    }}
                    initial={false}
                    animate={{ rotate: 0 }}
                  >
                    <div className="flex flex-row h-10 items-center w-full overflow-hidden">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-10 w-[33px] ${i % 2 === 0 ? "bg-white" : "bg-black"} -skew-x-12`}
                        />
                      ))}
                    </div>
                  </motion.div>
                  <Plus size={54} className="text-cyan-400 mt-2" />
                  <span className="mt-4 text-cyan-300 text-md font-semibold">Adaugă profil</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <button
          onClick={() => {
            console.log("[ManageProfiles] Click done -> navigate /");
            navigate("/");
          }}
          className="mt-16 mb-6 px-16 py-3 rounded-xl font-semibold text-lg shadow-md bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 hover:text-white transition focus:outline-none"
        >
          Done
        </button>
      </div>
    </div>
  );
}
