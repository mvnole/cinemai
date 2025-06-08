import React, { useRef, useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import films from "../data/films";
import { Play, Heart, X, Plus } from "lucide-react";
import { Player, BigPlayButton } from "video-react";
import { motion, AnimatePresence } from "framer-motion";
import "video-react/dist/video-react.css";

export function FilmPageModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const film = films.find((f) => f.id === id);
  const modalRef = useRef();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsClosing(true);
        setTimeout(() => navigate(location.state?.backgroundLocation || "/"), 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate, location]);

  if (!film) return null;

  const recommended = films.filter(f => f.id !== film.id && (f.genre === film.genre || !film.genre)).slice(0, 5);

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
            className="relative w-full max-w-4xl bg-zinc-900 text-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto scrollbar-invisible"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => navigate(location.state?.backgroundLocation || "/"), 300);
              }}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <X size={28} />
            </button>

            {/* PLAYER */}
            <div className="w-full aspect-video rounded-t-xl overflow-hidden border-b border-zinc-800">
              {film.previewUrl ? (
                <Player
                  playsInline
                  poster={film.image}
                  src={film.previewUrl}
                  fluid={true}
                  className="rounded-none"
                >
                  <BigPlayButton position="center" />
                </Player>
              ) : (
                <img
                  src={film.image}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* DETALII */}
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-3">{film.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2">
                <span>{film.genre}</span>
                <span>{film.duration || "1h 45min"}</span>
                <span>{film.rating || "⭐ 4.5 / 5"}</span>
              </div>
              <p className="text-base text-gray-300 mb-4">{film.description || "Acest film explorează o lume generată de AI..."}</p>
              <div className="flex gap-4 mb-6">
                <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
                  <Play size={20} /> Play
                </button>
                <button className="flex items-center gap-2 border border-gray-500 hover:border-white px-5 py-2 rounded-lg text-sm text-white font-medium">
                  <Heart size={20} /> Like
                </button>
              </div>
              <div className="text-xs text-gray-400 mb-6">
                <span className="font-semibold">Distribuție:</span> {film.cast?.join(", ") || "Actor 1, Actor 2, Actor 3"}
              </div>

              {/* RECOMANDĂRI */}
              <h2 className="text-xl font-semibold mb-3">Recomandări similare</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {recommended.map((f) => (
                  <Link to={`/film/${f.id}`} key={f.id} state={{ modal: true, backgroundLocation: location }} className="group bg-zinc-800 rounded-lg p-2 hover:bg-zinc-700 transition">
                    <div className="relative rounded-md overflow-hidden aspect-video mb-2">
                      <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                        {f.duration || "1h 45min"}
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
                      {f.description?.slice(0, 120) || "Un film generat de AI despre o aventură spectaculoasă."}
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
