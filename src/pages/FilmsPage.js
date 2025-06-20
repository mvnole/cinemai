import React, { useRef, useEffect, useState } from "react";
import Section from "../components/Section";
import { FilmPageModal } from "../components/FilmPageModal";
import films from "../data/films";
import { useLocation } from "react-router-dom";

function FilmsPage() {
  const location = useLocation();
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      slider.classList.add("dragging");
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      slider.classList.remove("dragging");
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      slider.classList.remove("dragging");

      // inertia simulation
      let velocity = 0;
      let lastX = null;
      const inertia = () => {
        if (Math.abs(velocity) < 0.1) return;
        slider.scrollLeft += velocity;
        velocity *= 0.95;
        requestAnimationFrame(inertia);
      };
      const handleMove = (e) => {
        const x = e.pageX - slider.offsetLeft;
        if (lastX !== null) velocity = (x - lastX) * 1.5;
        lastX = x;
      };
      slider.removeEventListener("mousemove", handleMove);
      slider.addEventListener("mousemove", handleMove);
      setTimeout(() => slider.removeEventListener("mousemove", handleMove), 100);
      requestAnimationFrame(inertia);
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      slider.scrollLeft = scrollLeft.current - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const genres = [...new Set(films.map(f => f.genre))];
  const top10 = films.slice(0, 10);

  return (
    <div className="space-y-14 pt-10 overflow-visible relative">
      <div className="px-20 sm:px-20">
        <h2 className="text-6xl font-extrabold text-white tracking-widest mb-8 text-center sm:text-left">
          <span className="bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-xl">
            TOP 10 MOVIES TODAY
          </span>
        </h2>
        <div className="relative group">
          <button
            onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black text-white rounded-full w-14 h-14 flex items-center justify-center sm:flex hidden pointer-events-auto transform hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            aria-label="Scroll Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black text-white rounded-full w-14 h-14 flex items-center justify-center sm:group-hover:flex hidden pointer-events-auto transition-all duration-300 ease-in-out transform hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Scroll Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          <div
            className="overflow-x-auto scrollbar-invisible cursor-default"
            ref={scrollRef}
          >
            <div className="flex gap-32 w-max pb-10 pt-2 px-12">
              {top10.map((film, index) => (
                <div
                  key={film.id}
                  className="film-card relative w-52 shrink-0 group hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setSelectedFilm(film)}
                >
                  {(index + 1) % 2 !== 0 && (
                    <div className="absolute -top-4 -left-10 text-[150px] font-extrabold text-white opacity-20 hover:opacity-40 drop-shadow-xl leading-none z-30">
                      {index + 1}
                    </div>
                  )}
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-80 object-cover rounded-xl shadow-xl border-2 border-gray-800 hover:border-white relative z-20"
                  />
                  {(index + 1) % 2 === 0 && (
                    <div className="absolute top-[200px] -left-16 text-[150px] font-extrabold text-white opacity-20 group-hover:opacity-40 drop-shadow-xl leading-none z-30">
                      {index + 1}
                    </div>
                  )}
                  <div className="mt-2 text-center text-sm text-gray-300 hover:text-white">
                    {film.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {genres.map((genre) => (
        <Section
          key={genre}
          title={genre}
          items={films.filter((f) => f.genre === genre)}
          location={location}
        />
      ))}

      {selectedFilm && (
        <FilmPageModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
      )}
    </div>
  );
}

export default FilmsPage;
