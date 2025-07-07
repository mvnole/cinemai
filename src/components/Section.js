import React from "react";
import FilmCard from "./FilmCard";
import { useLocation } from "react-router-dom";

function Section({
  title,
  items,
  location,
  favorites = [],
  toggleFavorite = () => {},
  showHeart = false
}) {
  return (
    <div className="px-4 space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-2">
        {items.map((film) => (
          <div key={film.id} className="shrink-0 w-60 group">
            <FilmCard
              film={film}
              location={location}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              showHeart={showHeart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Section;
