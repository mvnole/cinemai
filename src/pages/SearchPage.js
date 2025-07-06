import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FilmCard from "../components/FilmCard";
import { useFilms } from "../hooks/useFilms";

// Dropdown custom cu animații și efecte
function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-w-[150px] z-30">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          px-4 py-2 rounded-lg bg-zinc-800/80 border border-cyan-500/20 text-white
          flex justify-between items-center w-full shadow
          hover:ring-2 hover:ring-cyan-400 focus:ring-2 focus:ring-cyan-400
          transition-all
        `}
      >
        <span className="flex items-center gap-2">
          {label === "All Ratings" && value ? "⭐" : null} {value || label}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth={2}
        >
          <path d="M6 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <div
        className={`
          absolute mt-2 left-0 w-full bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-xl
          overflow-hidden transition-all duration-200 origin-top z-50
          ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}
        `}
        style={{ transformOrigin: "top center" }}
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className={`px-5 py-2 cursor-pointer transition-colors text-cyan-300
              ${value === opt.value ? "bg-cyan-700/60 text-white" : "hover:bg-zinc-800"}
            `}
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

  const { films, loading } = useFilms(query);

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
    <div className="relative min-h-screen w-full overflow-x-hidden">
      

      {/* Overlay bokeh/gradient */}
      <div className="pointer-events-none fixed z-0 inset-0">
        <div className="absolute w-96 h-96 bg-cyan-400 opacity-20 blur-3xl rounded-full left-[-6rem] top-[-4rem]"></div>
        <div className="absolute w-72 h-72 bg-violet-500 opacity-10 blur-2xl rounded-full right-[-3rem] top-[60%]"></div>
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-16">
        <div className="flex flex-col md:flex-row gap-6 items-center mb-14 justify-center z-10 relative">
          {/* Search bar cu efect modern */}
          <div className="relative flex-1 max-w-lg w-full">
            <input
              type="text"
              placeholder="Search for your next AI film adventure..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="
                w-full bg-zinc-900/90 border border-cyan-500/20 rounded-xl px-5 py-3
                text-lg text-white focus:ring-2 focus:ring-cyan-400 shadow-xl
                placeholder-cyan-300 transition-all
              "
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-300">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="10" cy="10" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
          </div>
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

        {/* Discover section (opțional) */}
        <div className="mb-8">
          <h2 className="text-2xl text-cyan-300 font-bold mb-2">
            Discover AI Cinema <span className="text-white/60 text-lg font-normal">— Powered by CinemAI</span>
          </h2>
        </div>

        {/* Grid results */}
        {loading ? (
          <div className="text-center py-16 text-lg text-cyan-300 animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 mt-8">
              {filteredFilms.map((film) => (
                <div
                  key={film.id}
                  onClick={() => handleFilmClick(film)}
                  className="relative w-full h-full cursor-pointer transform transition duration-300 hover:scale-105 hover:z-30 origin-center z-0"
                >
                  <FilmCard film={{ ...film, showTitleOverlay: false }} />
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && filteredFilms.length === 0 && (
          <div className="mt-24 text-center text-cyan-200 text-xl opacity-70">
            No films match your search... yet!
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
