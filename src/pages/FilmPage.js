import React from "react";
import { useParams } from "react-router-dom";

export function FilmPage({ films }) {
  const { id } = useParams();
  const film = films.find(f => f.id === id);

  if (!film) return <div>Film not found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{film.title}</h1>
      <img src={film.image} alt={film.title} className="w-full max-w-xl mb-4" />
      <p className="text-lg">Genre: {film.genre}</p>
    </div>
  );
}