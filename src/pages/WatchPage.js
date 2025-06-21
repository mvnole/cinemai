import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import films from "../data/films";
import {
  SkipBack,
  SkipForward,
  Volume2,
  Cast,
  Subtitles,
  Settings,
  Maximize2,
  Play,
  Pause,
  X
} from "lucide-react";

function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const film = films.find((f) => f.id === id);
  if (!film) return <div className="text-white p-10">Film inexistent.</div>;

  // Sources and tracks
  const sources = film.sources || {};
  const tracks = film.tracks || [];

  // Qualities and subtitles lists
  const defaultQualities = ["240p", "360p", "480p", "720p", "1080p"];
  const qualities = Object.keys(sources).length > 0 ? Object.keys(sources) : defaultQualities;
  const defaultSubs = ["Off"];
  const subtitles = tracks.length > 0 ? ["Off", ...tracks.map((t) => t.label)] : defaultSubs;

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubtitlesOptions, setShowSubtitlesOptions] = useState(false);

  // Selected quality and subtitle
  const [currentQuality, setCurrentQuality] = useState(qualities[0]);
  const [currentSubtitle, setCurrentSubtitle] = useState(subtitles[0]);

  // Update video element when quality changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (sources[currentQuality]) {
      const lastTime = video.currentTime;
      const playing = !video.paused;
      video.src = sources[currentQuality];
      video.load();
      video.currentTime = lastTime;
      if (playing) video.play();
    }
  }, [currentQuality, sources]);

  // Timeupdate and metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout;
    const reset = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", reset);
    container.addEventListener("mouseleave", () => setShowControls(false));
    reset();
    return () => {
      clearTimeout(timeout);
      container.removeEventListener("mousemove", reset);
      container.removeEventListener("mouseleave", () => setShowControls(false));
    };
  }, []);

  // Control handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  const handleSkip = (sec) => {
    const video = videoRef.current;
    video.currentTime = Math.min(Math.max(video.currentTime + sec, 0), video.duration);
  };
  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };
  const toggleFullscreen = () => {
    const el = videoRef.current.parentElement;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen();
  };
  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };
  const fmt = (t) => {
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen bg-black text-white ${
        showControls ? "cursor-auto" : "cursor-none"
      }`}
    >
      <video
        ref={videoRef}
        src={sources[currentQuality] || film.previewUrl}
        className="w-full h-full object-cover"
        autoPlay
      >
        {tracks.map((t, i) => (
          <track
            key={i}
            label={t.label}
            kind="subtitles"
            srcLang={t.lang}
            src={t.src}
            default={t.label === currentSubtitle}
          />
        ))}
      </video>

      {showControls && (
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 z-50 bg-black/50 p-2 rounded-full hover:bg-black"
        >
          <X size={24} />
        </button>
      )}

      <div
        className={`absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="h-1 w-full bg-gray-700 rounded cursor-pointer relative mb-4" onClick={seek}>
          <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
          <div className="absolute top-0" style={{ left: `${progress}%`, transform: "translateX(-50%)" }}>
            <div className="w-3 h-3 bg-red-600 rounded-full" />
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => handleSkip(-10)}><SkipBack size={24} /></button>
            <button onClick={togglePlay}>{isPlaying ? <Pause size={32} /> : <Play size={32} />}</button>
            <button onClick={() => handleSkip(10)}><SkipForward size={24} /></button>
            <button onClick={toggleMute}><Volume2 size={24} /></button>
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="hidden sm:block w-24" />
            <span className="text-sm hidden sm:block">{fmt(currentTime)}</span>
          </div>

          <div className="absolute inset-x-0 text-center pointer-events-none">
            <span className="text-sm font-semibold truncate px-4">{film.title}</span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm hidden sm:block">{fmt(duration)}</span>
            <button onClick={() => setShowSubtitlesOptions(!showSubtitlesOptions)} className="relative">
              <Subtitles size={24} />
              {showSubtitlesOptions && (
                <div className="absolute bottom-8 right-0 bg-black/80 rounded p-2 space-y-1">
                  {subtitles.map((sub) => (
                    <div key={sub} onClick={() => setCurrentSubtitle(sub)} className="cursor-pointer hover:text-red-600">
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="relative">
              <Settings size={24} />
              {showSettings && (
                <div className="absolute bottom-8 right-0 bg-black/80 rounded p-2 space-y-1">
                  {qualities.map((q) => (
                    <div key={q} onClick={() => setCurrentQuality(q)} className="cursor-pointer hover:text-red-600">
                      {q}
                    </div>
                  ))}
                </div>
              )}
            </button>
            <button onClick={toggleFullscreen}><Maximize2 size={24} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchPage;
