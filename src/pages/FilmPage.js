import React from "react";
import { useParams } from "react-router-dom";
import films from "../data/films";

export function FilmPage() {
  const { id } = useParams();
  const film = films.find((f) => f.id === id);

  if (!film) return <p className="text-red-500">Film not found.</p>;

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-4xl font-bold">{film.title}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {film.previewUrl ? (
          <video
            src={film.previewUrl}
            controls
            className="w-full md:w-1/2 rounded-lg shadow-lg"
          />
        ) : (
          <img
            src={film.image}
            alt={film.title}
            className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
          />
        )}
        <div className="space-y-4">
          <p><span className="font-semibold">Gen:</span> {film.genre}</p>
          <p><span className="font-semibold">Durată:</span> {film.duration || "1h 45min"}</p>
          <p><span className="font-semibold">Rating:</span> {film.rating || "⭐ 4.5 / 5"}</p>
          <p><span className="font-semibold">Descriere:</span> {film.description || "Acest film explorează o lume generată de AI în care..."}</p>
          <p><span className="font-semibold">Distribuție:</span> {film.cast?.join(", ") || "Actor 1, Actor 2, Actor 3"}</p>
        </div>
      </div>
    </div>
  );
}
