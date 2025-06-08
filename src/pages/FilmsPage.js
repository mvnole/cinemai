import React, { useRef, useEffect } from "react";
import Section from "../components/Section";
import films from "../data/films";
import { useLocation } from "react-router-dom";

function FilmsPage() {
  const location = useLocation();
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      hasMoved.current = false;
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
    };

    const handleMouseUp = (e) => {
      if (hasMoved.current) {
        e.preventDefault();
        e.stopPropagation();
      }
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

  return (
    <div className="space-y-14 pt-10 overflow-visible">
      <div className="px-20 sm:px-20">
        <h2 className="text-6xl font-extrabold text-white tracking-widest mb-8 text-center sm:text-left">
          <span className="bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-xl">
            TOP 10 MOVIES TODAY
          </span>
        </h2>
        <div className="relative">
          <div
            className="overflow-x-auto scrollbar-invisible cursor-grab active:cursor-grabbing"
            ref={scrollRef}
          >
            <div className="flex gap-32 w-max pb-10 pt-2 px-12">
              {top10.map((film, index) => (
                <div
                  key={film.id}
                  className="relative w-52 shrink-0 group hover:scale-105 transition-transform duration-300"
                  onClickCapture={(e) => {
                    if (hasMoved.current) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  {(index + 1) % 2 !== 0 && (
                    <div className="absolute -top-4 -left-10 text-[150px] font-extrabold text-white opacity-20 group-hover:opacity-40 drop-shadow-xl leading-none z-30">
                      {index + 1}
                    </div>
                  )}
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-80 object-cover rounded-xl shadow-xl border-2 border-gray-800 group-hover:border-white relative z-20"
                  />
                  {(index + 1) % 2 === 0 && (
                    <div className="absolute top-[200px] -left-16 text-[150px] font-extrabold text-white opacity-20 group-hover:opacity-40 drop-shadow-xl leading-none z-30">
                      {index + 1}
                    </div>
                  )}
                  <div className="mt-2 text-center text-sm text-gray-300 group-hover:text-white">
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
