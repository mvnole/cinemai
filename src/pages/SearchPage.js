import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FilmCard from "../components/FilmCard";
import { useFilms } from "../hooks/useFilms"; // 🔥 import hook

function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded bg-zinc-800 text-white flex justify-between items-center w-40"
      >
        <span className="flex items-center gap-2">
          {label === "All Ratings" && value ? "⭐" : null} {value || label}
        </span>
        <span className="ml-2">▾</span>
      </button>
      <div
        className={`absolute mt-2 w-full bg-zinc-800 rounded shadow-md transition-all duration-200 origin-top transform z-10 ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className="px-4 py-2 hover:bg-zinc-700 cursor-pointer"
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Folosești hook-ul cu search live după titlu!
  const { films, loading } = useFilms(query);
  console.log("FILMS FROM DB:", films);

  // Filtrare suplimentară după gen și rating (poate adaugi și în backend pe viitor)
  const filteredFilms = films.filter((film) => {
    const matchesGenre = genreFilter ? film.genre === genreFilter : true;
    const matchesRating = ratingFilter
      ? parseFloat(
          typeof film.rating === "string"
            ? film.rating?.split(" ")[1]
            : film.rating
        ) >= parseFloat(ratingFilter)
      : true;
    return matchesGenre && matchesRating;
  });

  const handleFilmClick = (film) => {
    navigate(`/film/${film.id}`, {
      state: {
        modal: true,
        fromSearch: true,
        backgroundLocation: location,
      },
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-4 items-start">
        <input
          type="text"
          placeholder="Search films..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 w-full max-w-xs"
        />
        <Dropdown
          label="All Genres"
          value={genreFilter}
          onChange={setGenreFilter}
          options={[
            { label: "All Genres", value: "" },
            { label: "Sci-Fi", value: "Sci-Fi" },
            { label: "Action", value: "Action" },
            { label: "Drama", value: "Drama" },
            { label: "Thriller", value: "Thriller" },
            { label: "Mystery", value: "Mystery" },
            { label: "Fantasy", value: "Fantasy" },
            { label: "Adventure", value: "Adventure" },
          ]}
        />
        <Dropdown
          label="All Ratings"
          value={ratingFilter}
          onChange={setRatingFilter}
          options={[
            { label: "All Ratings", value: "" },
            { label: "⭐ 4.5+", value: "4.5" },
            { label: "⭐ 4.0+", value: "4.0" },
            { label: "⭐ 3.5+", value: "3.5" },
          ]}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-6 mt-24 sm:mt-48">
            {filteredFilms.map((film) => (
              <div
                key={film.id}
                onClick={() => handleFilmClick(film)}
                className="relative w-full h-full cursor-pointer transform transition duration-300 hover:scale-105 hover:z-50 origin-center z-0"
              >
                <FilmCard film={{ ...film, showTitleOverlay: false }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
