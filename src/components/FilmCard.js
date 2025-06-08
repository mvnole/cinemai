import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart } from "lucide-react";

function FilmCard({ film, location }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/film/${film.id}`}
      state={{ modal: true, backgroundLocation: location }}
      className="relative w-56 shrink-0 block cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }}
    >
      <img
        src={film.image}
        alt={film.title}
        className={`w-full h-full object-cover rounded transition-transform duration-300 ${
          isHovered ? "scale-110 z-20 shadow-2xl" : "z-20"
        }`}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 30 }}
            transition={{ duration: 0.45 }}
            style={{ transformOrigin: "bottom center" }}
            className="absolute top-[-220px] left-[-60px] w-[320px] z-30 rounded-lg bg-zinc-900 shadow-2xl p-4 text-white"
          >
            <div className="block w-full h-48 overflow-hidden rounded-lg mb-4">
              {film.previewUrl ? (
                <video
                  ref={videoRef}
                  src={film.previewUrl}
                  muted
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={film.image}
                  alt={film.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
            <h3 className="font-bold text-xl mb-2">{film.title}</h3>
            <p className="text-sm text-gray-300 mb-4 line-clamp-4">
              {film.description}
            </p>
            <div className="flex space-x-4">
              <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-md">
                <Play size={20} />
                Play
              </button>
              <button className="flex items-center gap-2 border border-gray-400 hover:border-white px-4 py-2 rounded-md">
                <Heart size={20} />
                Like
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default FilmCard;
