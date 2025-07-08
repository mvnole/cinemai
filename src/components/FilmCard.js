import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ThumbsUp } from "lucide-react";
import { useFavorite } from "../hooks/useFavorite";
import { useUser } from "../context/UserContext";
import { voteFilm, getFilmAverageRating } from "../utils/voteFilm";
import { supabase } from "../utils/supabaseClient";


function FilmCard({ film }) {
  if (!film) return null;

  useEffect(() => {
    if (!film?.id) return;

    async function fetchRating() {
      const avg = await getFilmAverageRating(film.id);
      setAvgRating(avg);
    }
    fetchRating();
  }, [film?.id]);
  
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // VOTING
  const [userVote, setUserVote] = useState(null); // 5=like, 1=dislike, null=neutru
  const [avgRating, setAvgRating] = useState(film.rating || 0);

  // Hook-ul pentru favorite
  const { isFavorite, addFavorite, removeFavorite } = useFavorite(film.id, user?.id);

  // Preia votul userului și ratingul mediu la mount sau când se schimbă filmul/userul
  useEffect(() => {
    async function fetchVotes() {
      if (user?.id && film.id) {
        // Vot user curent
        const { data } = await supabase
          .from("film_votes")
          .select("vote")
          .eq("film_id", film.id)
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) setUserVote(data.vote);
        else setUserVote(null);

        // Media (dacă nu e deja ca prop)
        const avg = await getFilmAverageRating(film.id);
        if (avg !== null) setAvgRating(avg);
      }
    }
    fetchVotes();
  }, [film.id, user?.id]);

  // Votează like/dislike cu toggle (anulare la click pe același)
  async function handleVote(vote) {
    if (!user?.id) {
      alert("Trebuie să fii logat ca să votezi!");
      return;
    }
    let newVote = vote;
    if (userVote === vote) {
      newVote = null;
    }
    await voteFilm(film.id, user.id, newVote);
    setUserVote(newVote);
    const avg = await getFilmAverageRating(film.id);
    if (avg !== null) setAvgRating(avg);
  }

  const handleClick = () => {
    navigate(`/film/${film.id}`, {
      state: {
        modal: true,
        backgroundLocation: location,
      },
    });
  };

  // ==== CHEIA CORECTĂ PENTRU SURSA VIDEO ====
  const videoUrl =
    film.preview_url ||
    film.previewUrl ||
    film.video_url ||
    film.videoUrl ||
    "";

  // Autoplay video pe hover
  useEffect(() => {
    const video = videoRef.current;
    if (isHovered && video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else if (!isHovered && video) {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, videoUrl]); // reacționează și dacă se schimbă sursa!

  // Extrage genul din genres (array sau string)
  const genreText = film.genre || (Array.isArray(film.genres) ? film.genres.join(" • ") : film.genres);

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={film.image}
        alt={film.title}
        className={`w-full h-full object-cover rounded-lg transition-transform duration-300 ${
          isHovered ? "scale-110 z-20 shadow-2xl" : "z-10"
        }`}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[-160px] left-[-48px] w-[432px] z-30 rounded-xl
              bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl
              text-white overflow-hidden"
            style={{ transformOrigin: "bottom center" }}
          >
            {/* Preview Video/Image */}
            <div className="w-full h-64 overflow-hidden mb-4">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={film.image}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Title & Description */}
            <div className="px-6 mb-4">
              <h3 className="text-2xl font-bold mb-2">{film.title}</h3>
              <div className="flex flex-wrap gap-3 text-gray-300 mb-2 text-sm">
                {genreText && <span>{genreText}</span>}
                {film.duration && <span>{film.duration}</span>}
              </div>
              <p className="text-sm text-gray-300 line-clamp-3">{film.description}</p>
            </div>

            {/* Play + Metadata + Actions */}
            <div className="flex items-start px-6 mb-4 space-x-6">
              <div className="flex flex-col space-y-2">
                <button className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg text-lg">
                  <Play size={24} /> Play
                </button>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  {film.ageRating && <span>{film.ageRating}</span>}
                  {film.quality && <span>{film.quality}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto mt-1">
  {/* LIKE button */}
  <motion.button
    whileTap={{ scale: 0.93 }}
    whileHover={{ scale: 1.13 }}
    className={`
      rounded-full p-2 border-2
      ${userVote === 5 ? "text-cyan-400 border-cyan-400" : "text-zinc-400 border-zinc-500"}
      bg-transparent transition-colors duration-200
    `}
    onClick={e => {
      e.stopPropagation();
      handleVote(5);
    }}
    type="button"
    aria-label="Like"
    title="Like"
    tabIndex={0}
    style={{ background: "none" }}
  >
    <ThumbsUp size={28} strokeWidth={2.1} />
  </motion.button>

  {/* DISLIKE button */}
  <motion.button
    whileTap={{ scale: 0.93 }}
    whileHover={{ scale: 1.13 }}
    className={`
      rounded-full p-2 border-2
      ${userVote === 1 ? "text-rose-400 border-rose-400" : "text-zinc-400 border-zinc-500"}
      bg-transparent transition-colors duration-200
    `}
    onClick={e => {
      e.stopPropagation();
      handleVote(1);
    }}
    type="button"
    aria-label="Dislike"
    title="Dislike"
    tabIndex={0}
    style={{ background: "none" }}
  >
    <ThumbsUp className="rotate-180" size={28} strokeWidth={2.1} />
  </motion.button>

                {/* STAR / RATING */}
                <span
                  className="flex items-center gap-1 font-bold text-lg text-yellow-400 select-none"
                  title="Rating mediu"
                  style={{ minWidth: 54, justifyContent: "center" }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 20 20"
                    fill="url(#star-gradient)"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: 3, display: "block" }}
                  >
                    <defs>
                      <linearGradient id="star-gradient" x1="0" y1="0" x2="0" y2="20" gradientUnits="userSpaceOnUse">
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

                {/* INIMA (Favorite) */}
                <motion.button
                  whileTap={{ scale: 0.92, rotate: 10 }}
                  whileHover={{ scale: 1.18 }}
                  onClick={e => {
                    e.stopPropagation();
                    if (!user) {
                      alert("Trebuie să fii logat ca să adaugi la favorite!");
                      return;
                    }
                    if (isFavorite) removeFavorite();
                    else addFavorite();
                  }}
                  type="button"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  className="bg-transparent p-0 m-0 border-0 focus:outline-none active:outline-none"
                  tabIndex={0}
                  style={{ background: "none", outline: "none", boxShadow: "none" }}
                >
                  <svg
                    width={32}
                    height={32}
                    viewBox="0 0 24 24"
                    style={{
                      display: "block",
                      filter: isFavorite ? "drop-shadow(0 0 8px #ef444477)" : "none",
                      transition: "filter 0.18s",
                    }}
                  >
                    <path
                      d="M12 21C12 21 4 13.882 4 8.824 4 5.515 6.613 3 9.915 3c1.519 0 2.959.816 3.72 2.09C14.126 3.816 15.566 3 17.085 3 20.387 3 23 5.515 23 8.824c0 5.058-8 12.176-8 12.176z"
                      fill={isFavorite ? "#ef4444" : "none"}
                      stroke={isFavorite ? "#ef4444" : "#fff"}
                      strokeWidth={2.3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilmCard;
