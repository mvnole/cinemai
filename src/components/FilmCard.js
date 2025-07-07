import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ThumbsUp, ChevronDown } from "lucide-react";
import { useFavorite } from "../hooks/useFavorite";
import { useUser } from "../context/UserContext";

function FilmCard({ film }) {
  if (!film) return null;

  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false); // stare locală pt. like
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // Hook-ul pentru favorite
  const { isFavorite, addFavorite, removeFavorite } = useFavorite(film.id, user?.id);
  const [animateFav, setAnimateFav] = useState(false);

  useEffect(() => {
    if (isHovered) setAnimateFav(true);
    const timeout = setTimeout(() => setAnimateFav(false), 350);
    return () => clearTimeout(timeout);
  }, [isFavorite, isHovered]);

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

  function handleLike(e) {
    e.stopPropagation(); // nu mai pornește modalul!
    setLiked((prev) => !prev);
  }

  // FavoriteButton custom
  function FavoriteButton() {
    return (
      <motion.button
        className={`p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center`}
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={e => {
          e.stopPropagation();
          if (!user) {
            alert("Trebuie să fii logat ca să adaugi la favorite!");
            return;
          }
          if (isFavorite) removeFavorite();
          else addFavorite();
        }}
        whileTap={{ scale: 0.8 }}
        animate={isFavorite && animateFav ? { scale: 1.3 } : { scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
        tabIndex={0}
      >
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          style={{
            display: "block",
            filter: isFavorite ? "drop-shadow(0 0 8px #ef444477)" : "none",
            transition: "filter 0.2s",
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
    );
  }

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
                  {film.duration && <span>{film.duration}</span>}
                </div>
              </div>
              <div className="flex space-x-4 ml-auto mt-1">
                {/* Butonul de plus a fost scos */}
                <button
  className={`p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full ${liked ? "text-cyan-400" : "text-white"}`}
  onClick={e => {
    e.stopPropagation();
    setLiked(prev => !prev);
  }}
  type="button"
  aria-label={liked ? "Unlike" : "Like"}
>
  <ThumbsUp size={20} />
</button>
                {/* FavoriteButton NOU */}
                <FavoriteButton />
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>

            {/* Genres */}
            {film.genres && (
              <div className="px-6 pb-4 text-base text-gray-300">
                {film.genres.join(" • ")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilmCard;
