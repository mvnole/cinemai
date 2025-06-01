import React from "react";
import FilmCard from "./FilmCard";

function Section({ title, items }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-6">
        {items.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}

export default Section;
