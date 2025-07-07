import React from "react";
import YouTube from "react-youtube";
import { useNavigate, useLocation } from "react-router-dom";

const HeroBanner = ({ videoId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      playlist: videoId,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <div className="hidden sm:block relative w-screen h-screen overflow-hidden pb-24 z-0">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <YouTube
          videoId={videoId}
          opts={opts}
          className="absolute top-0 left-0 w-full h-full"
          iframeClassName="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-0 p-10 max-w-2xl text-gray-200">
        <p className="text-xs uppercase mb-2">AI ORIGINAL</p>
        <h1 className="text-6xl font-extrabold mb-6">Trending AI Movie</h1>
        <p className="text-base mb-8">Experience the most advanced AI-generated story yet. CinemAI takes you to the edge of reality.</p>
        <button
          onClick={() =>
            navigate("/film/6721038b-4478-490d-993d-7cdcb147288b", {
              state: {
                modal: true,
                backgroundLocation: location,
              },
            })
          }
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg rounded-md transition"
        >
          Go to Movie
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
