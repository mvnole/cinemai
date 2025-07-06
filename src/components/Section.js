import React from "react";
import FilmCard from "./FilmCard";
import { useLocation } from "react-router-dom";

function Section({ title, items }) {
  const location = useLocation();

  return (
    <div className="px-4 space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-12 overflow-visible flex-wrap pb-2">
        {items.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            location={location}
            className="shrink-0 w-48 group"
          />
        ))}
      </div>
    </div>
  );
}

export default Section;
