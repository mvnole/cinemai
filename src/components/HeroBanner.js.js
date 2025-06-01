// components/HeroBanner.js
import React from "react";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      playlist: "eoOaKN4qCKw" // necesar pentru loop
    },
  };

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-0">
        <YouTube videoId="eoOaKN4qCKw" opts={opts} className="w-full h-full object-cover" iframeClassName="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 p-10 max-w-2xl text-white">
        <p className="text-xs uppercase mb-2">AI ORIGINAL</p>
        <h1 className="text-5xl font-bold mb-4">Trending AI Movie</h1>
        <p className="text-sm mb-6">Experience the most advanced AI-generated story yet. CinemAI takes you to the edge of reality.</p>
        <button
          onClick={() => navigate("/film/1")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md transition"
        >
          Go to Movie
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
