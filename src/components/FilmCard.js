import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function FilmCard({ film }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/film/${film.id}`}
      className="group relative rounded overflow-hidden transition-all duration-300 aspect-video"
      style={{ width: isHovered ? "36rem" : "18rem" }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }}
    >
      {film.previewUrl && isHovered ? (
        <video
          ref={videoRef}
          src={film.previewUrl}
          muted
          className="w-full h-full object-cover transition-all duration-300"
        />
      ) : (
        <img
          src={film.poster}
          alt={film.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
      )}
      
    </Link>
  );
}

export default FilmCard;
