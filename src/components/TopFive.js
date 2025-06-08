import React from "react";
import { Link, useLocation } from "react-router-dom";

function TopFive({ films }) {
  const location = useLocation();
  const topFive = films.slice(0, 5);

  return (
    <div className="space-y-4 pl-0 sm:pl-16">
      <h2 className="text-3xl font-extrabold text-white px-4 tracking-wide">
        TOP 5 MOVIES TODAY
      </h2>
      <div className="overflow-x-auto pr-4 py-4">
        <div className="flex gap-6">
          {topFive.map((film, index) => (
            <Link
              key={film.id}
              to={`/film/${film.id}`}
              state={{ modal: true, backgroundLocation: location }}
              className="relative w-56 shrink-0 group hover:scale-105 transition-transform duration-300 px-10 cursor-pointer"
            >
              <div
                className={
                  "absolute -left-3 " +
                  (index % 2 === 0 ? "top-16 z-20" : "top-0 z-20") +
                  " text-[160px] font-extrabold text-white opacity-30 group-hover:opacity-50 drop-shadow-xl leading-none"
                }
              >
                {index + 1}
              </div>
              <img
                src={film.image}
                alt={film.title}
                className="w-full h-72 object-cover rounded-xl shadow-xl border-2 border-gray-800 group-hover:border-white relative z-10"
              />
              <div className="mt-2 text-center text-sm text-gray-300 group-hover:text-white">
                {film.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopFive;
