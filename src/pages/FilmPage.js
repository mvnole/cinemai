import React from "react";
import { useParams, Link } from "react-router-dom";
import films from "../data/films";
import { Play, Heart } from "lucide-react";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";

export function FilmPage() {
  const { id } = useParams();
  const film = films.find((f) => f.id === id);

  if (!film) return <p className="text-red-500 p-8">Film not found.</p>;

  // Recomandări simple (poți schimba criteriul)
  const recommended = films.filter(f => f.id !== film.id && (f.genre === film.genre || !film.genre)).slice(0, 5);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fundal blur */}
      <div
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          background: `url(${film.previewUrl ? film.poster || film.image : film.image}) center/cover no-repeat`,
          filter: "blur(18px) brightness(0.32)",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/70 to-zinc-900/80 -z-10" />

      {/* CONȚINUT */}
      <div className="max-w-3xl overflow-y-auto mx-auto px-4 pt-10 pb-20">
        {/* PLAYER VIDEO/POSER */}
        <div className="w-full rounded-2xl overflow-hidden border border-zinc-700 bg-black/70 shadow-lg aspect-video mb-8">
          {film.previewUrl ? (
            <Player
              playsInline
              poster={film.image}
              src={film.previewUrl}
              fluid={true}
              className="rounded-2xl"
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
        {/* DETALII FILM */}
        <h1 className="text-4xl font-extrabold mb-4">{film.title}</h1>
        <div className="flex flex-wrap gap-4 text-base text-gray-300 mb-2">
          <span>{film.genre}</span>
          <span>{film.duration || "1h 45min"}</span>
          <span>{film.rating || "⭐ 4.5 / 5"}</span>
        </div>
        <p className="text-lg text-gray-200 mb-4">{film.description || "Acest film explorează o lume generată de AI..."}</p>
        <div className="flex gap-4 mb-4">
          <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-xl text-lg font-semibold shadow">
            <Play size={24} /> Play
          </button>
          <button className="flex items-center gap-2 border border-gray-400 hover:border-white px-6 py-2 rounded-xl text-lg text-white font-semibold shadow">
            <Heart size={24} /> Like
          </button>
        </div>
        <div className="text-sm text-gray-400 mb-8">
          <span className="font-semibold">Distribuție:</span> {film.cast?.join(", ") || "Actor 1, Actor 2, Actor 3"}
        </div>

        {/* RECOMANDĂRI */}
        <h2 className="text-2xl font-bold mb-4">Recomandări similare</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {recommended.map((f) => (
            <Link to={`/film/${f.id}`} key={f.id} className="group">
              <div className="rounded-lg overflow-hidden shadow-md bg-zinc-900 group-hover:scale-105 transition-transform aspect-[2/3] border border-zinc-800">
                <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-2 text-center text-sm text-gray-200 group-hover:text-cyan-400 transition">{f.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
 
);
  
}
