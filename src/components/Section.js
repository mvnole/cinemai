import React from "react";
import FilmCard from "./FilmCard";
import { useLocation, Link } from "react-router-dom";

function Section({ title, items }) {
  const location = useLocation();

  return (
    <div className="px-4 space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-12 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-2">
        {items.map((film) => (
          <div key={film.id} className="shrink-0 w-48 group">
            <Link
              to={`/film/${film.id}`}
              state={{ modal: true, backgroundLocation: location }}
            >
              <FilmCard film={film} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Section;
