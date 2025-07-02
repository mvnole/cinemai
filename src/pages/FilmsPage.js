import React, { useRef, useEffect, useState } from "react";
import Section from "../components/Section";
import films from "../data/films";
import { useLocation, useNavigate } from "react-router-dom";

function FilmsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleMouseDown = (e) => {
      if (e.target.closest(".film-card")) return;
      isDragging.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      hasMoved.current = false;
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      if (Math.abs(walk) > 5) {
        hasMoved.current = true;
      }
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

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-14 pt-10 overflow-visible">
      <div className="px-4 sm:px-20">
        <h2 className="text-3xl sm:text-6xl font-extrabold text-white tracking-widest mb-8 text-center sm:text-left">
          <span className="bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-xl">
            TOP 10 MOVIES TODAY
          </span>
        </h2>
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {isHovered && (
            <div className="absolute inset-0 z-30 justify-between items-center px-2 pointer-events-none hidden sm:flex">
              <button
                onClick={() => handleScroll('left')}
                className="pointer-events-auto z-40 text-white w-24 h-full flex items-center justify-center transition duration-300 ease-in-out"
                aria-label="Scroll Left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="pointer-events-auto z-40 text-white w-24 h-full flex items-center justify-center transition duration-300 ease-in-out"
                aria-label="Scroll Right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}

          <div
            className="overflow-x-auto scrollbar-invisible cursor-grab active:cursor-grabbing"
            ref={scrollRef}
          >
            <div className="flex gap-6 sm:gap-32 w-max pb-10 pt-2 px-2 sm:px-12">
              {top10.map((film, index) => (
                <div
                  key={film.id}
                  className="film-card relative w-32 sm:w-52 shrink-0 group hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onMouseDown={() => (hasMoved.current = false)}
                  onMouseMove={() => (hasMoved.current = true)}
                  onClick={() => {
                    if (hasMoved.current) return;
                    navigate(`/film/${film.id}`, {
                      state: { backgroundLocation: location, modal: true }
                    });
                  }}
                >
                  {(index + 1) % 2 !== 0 && (
                    <div className="absolute -top-4 -left-6 sm:-left-10 text-[100px] sm:text-[150px] font-extrabold text-white opacity-20 group-hover:opacity-0 transition-opacity duration-300 drop-shadow-xl leading-none z-30">
                      {index + 1}
                    </div>
                  )}
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-44 sm:h-80 object-cover rounded-xl shadow-xl border-2 border-gray-800 hover:border-white relative z-20"
                  />
                  {(index + 1) % 2 === 0 && (
                    <div className="absolute top-[100px] sm:top-[200px] -left-6 sm:-left-16 text-[100px] sm:text-[150px] font-extrabold text-white opacity-20 group-hover:opacity-0 transition-opacity duration-300 drop-shadow-xl leading-none z-30">
                      {index + 1}
                    </div>
                  )}
                  <div className="mt-2 text-center text-xs sm:text-sm text-gray-300 group-hover:text-white">
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
    </div>
  );
}

export default FilmsPage;
