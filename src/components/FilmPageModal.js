import React, { useRef, useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Play, Heart, X, Plus, ThumbsUp } from "lucide-react";
import { Player, BigPlayButton } from "video-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilms } from "../hooks/useFilms";
import { getFilmAverageRating, voteFilm } from "../utils/voteFilm";
import { useUser } from "../context/UserContext";
import "video-react/dist/video-react.css";
import { supabase } from "../utils/supabaseClient";

export function FilmPageModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { films, loading } = useFilms();
  const film = films.find((f) => f.id === id);
  const modalRef = useRef();
  const playerRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // MUTAREA AICI
  const { user } = useUser();

  // === RATING DIN SUPABASE ===
  const [avgRating, setAvgRating] = useState(null);

  // VOT USER
  const [userVote, setUserVote] = useState(null); // 5 = like, 1 = dislike, null = neutru

  useEffect(() => {
    async function fetchVotes() {
      if (!film?.id) return;

      const avg = await getFilmAverageRating(film.id);
      setAvgRating(avg);

      if (user?.id) {
        const { data } = await supabase
          .from("film_votes")
          .select("vote")
          .eq("film_id", film.id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (data) setUserVote(data.vote);
        else setUserVote(null);
      } else {
        setUserVote(null);
      }
    }
    fetchVotes();
  }, [film?.id, user?.id]);

  // VOTEAZĂ LIKE/DISLIKE cu toggle (anulare la același click)
  async function handleVote(vote) {
    if (!user?.id) {
      alert("Trebuie să fii logat ca să votezi!");
      return;
    }
    let newVote = vote;
    if (userVote === vote) {
      newVote = null; // anulează votul
    }
    await voteFilm(film.id, user.id, newVote);
    setUserVote(newVote);
    const avg = await getFilmAverageRating(film.id);
    if (avg !== null) setAvgRating(avg);
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsClosing(true);
        setTimeout(() => navigate(location.state?.backgroundLocation || "/", { replace: true }), 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate, location]);

  // Auto-play on ready
  const handlePlayerReady = () => {
    const player = playerRef.current;
    if (player && player.play) {
      player.muted = true;
      player.play();
      setTimeout(() => {
        player.muted = false;
      }, 500);
    }
  };

  if (loading) return null;
  if (!film) return null;

  const recommended = films
    .filter((f) => f.id !== film.id && (f.genre === film.genre || !film.genre))
    .slice(0, 5);

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-start justify-center p-4 overflow-y-auto scrollbar-invisible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-4xl
              bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl
              text-white rounded-xl max-h-[90vh] overflow-y-auto scrollbar-invisible"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => navigate(location.state?.backgroundLocation || "/", { replace: true }), 300);
              }}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <X size={28} />
            </button>

            {/* PLAYER */}
            <div className="w-full aspect-video rounded-t-xl overflow-hidden border-b border-zinc-800">
              {film.previewUrl ? (
                <Player
                  ref={playerRef}
                  playsInline
                  autoPlay
                  muted
                  poster={film.image}
                  src={film.previewUrl}
                  fluid
                  className="rounded-none"
                  onReady={handlePlayerReady}
                >
                  <BigPlayButton position="center" style={{ display: "none" }} />
                </Player>
              ) : (
                <img
                  src={film.image}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* DETAILS */}
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-3">{film.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2 items-center">
                <span>{film.genre}</span>
                <span>{film.duration || "—"}</span>
                <span className="flex items-center gap-1 text-yellow-400 font-bold text-base">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 20 20"
                    fill="url(#star-gradient)"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: 3, display: "block" }}
                  >
                    <defs>
                      <linearGradient
                        id="star-gradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="20"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#ffe07a" />
                        <stop offset="1" stopColor="#ffae00" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M10 15.273l-5.618 3.309 1.566-6.291-4.618-4.014 6.316-.516L10 1.5l2.354 6.261 6.316.516-4.618 4.014 1.566 6.291z"
                      fill="url(#star-gradient)"
                      stroke="#ffae00"
                      strokeWidth="0.7"
                    />
                  </svg>
                  {avgRating ? avgRating.toFixed(1) : "—"}
                </span>
              </div>
              <p className="text-base text-gray-300 mb-4">
                {film.description || "Acest film explorează o lume generată de AI..."}
              </p>
              <div className="flex gap-4 mb-6 items-center">
                <button
                  onClick={() => navigate(`/watch/${film.id}`)}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
                >
                  <Play size={20} /> Play
                </button>

                {/* LIKE button */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.14 }}
                  className="group bg-transparent p-0 m-0 border-0 focus:outline-none active:outline-none"
                  onClick={e => {
                    e.stopPropagation();
                    handleVote(5);
                  }}
                  type="button"
                  aria-label="Like"
                  title="Like"
                  tabIndex={0}
                  style={{ background: "none", outline: "none", boxShadow: "none" }}
                >
                  <ThumbsUp
                    size={30}
                    strokeWidth={2.1}
                    className={`transition-colors duration-200
                    ${userVote === 5 ? "text-cyan-400" : "text-zinc-400 group-hover:text-cyan-400"}
                  `}
                  />
                </motion.button>

                {/* DISLIKE button */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.14 }}
                  className="group bg-transparent p-0 m-0 border-0 focus:outline-none active:outline-none"
                  onClick={e => {
                    e.stopPropagation();
                    handleVote(1);
                  }}
                  type="button"
                  aria-label="Dislike"
                  title="Dislike"
                  tabIndex={0}
                  style={{ background: "none", outline: "none", boxShadow: "none" }}
                >
                  <ThumbsUp
                    size={30}
                    strokeWidth={2.1}
                    className={`rotate-180 transition-colors duration-200
                    ${userVote === 1 ? "text-rose-400" : "text-zinc-400 group-hover:text-rose-400"}
                  `}
                  />
                </motion.button>
              </div>
              <div className="text-xs text-gray-400 mb-6">
                <span className="font-semibold">Credits:</span>{" "}
                {film.credits
                  ? film.credits
                  : (Array.isArray(film.cast) ? film.cast.join(", ") : film.cast) || "N/A"}
              </div>

              {/* RECOMMENDATIONS */}
              <h2 className="text-xl font-semibold mb-3">Recommendations</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {recommended.map((f) => (
                  <Link
                    to={`/film/${f.id}`}
                    key={f.id}
                    state={{
                      modal: true,
                      backgroundLocation: location.state?.backgroundLocation || location,
                    }}
                    className="group bg-zinc-800 rounded-lg p-2 hover:bg-zinc-700 transition"
                  >
                    <div className="relative rounded-md overflow-hidden aspect-video mb-2">
                      <img
                        src={f.image}
                        alt={f.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                        {f.duration || "—"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="border border-gray-400 px-1.5 rounded">HD</span>
                        <span>{f.year || "2024"}</span>
                        <span>{f.age || "13+"}</span>
                      </div>
                      <Plus size={14} />
                    </div>
                    <div className="text-sm font-semibold text-white mb-1 truncate">
                      {f.title}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-3">
                      {f.description?.slice(0, 120) ||
                        "Un film generat de AI despre o aventură spectaculoasă."}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
