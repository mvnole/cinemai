import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

<video
  ref={videoRef}
  src={film.previewUrl}
  muted
  autoPlay
  playsInline
  loop
  className="absolute inset-0 w-full h-full object-cover z-10"
/>
export const FilmCard = ({ film }) => {
  return (
    <div className="relative group w-48 h-72 flex-shrink-0 transition-transform duration-300 hover:scale-125">
      <Link to={`/film/${film.id}`}>
        <img
          src={film.image}
          alt={film.title}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-center p-4 rounded-md">
          <Play size={40} className="mb-2" />
          <h3 className="text-lg font-bold">{film.title}</h3>
          <p className="text-sm">{film.genre}</p>
        </div>
      </Link>
    </div>
  );
};
