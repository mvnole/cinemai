// src/pages/WatchPage.js

import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFilms } from "../hooks/useFilms";
import { motion, AnimatePresence } from "framer-motion";
import {
  SkipBack, SkipForward, Volume2, Subtitles, Maximize2,
  Play, Pause, X, Minimize2
} from "lucide-react";

function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // HOOK-URI la început
  const { films, loading } = useFilms();
  const [isPlaying, setIsPlaying] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSubsOptions, setShowSubsOptions] = useState(false);
  const [currentQuality, setCurrentQuality] = useState("720p");
  const [currentSubtitle, setCurrentSubtitle] = useState("Off");

  // Derive film și variabile strict după hook-uri
  const film = films.find(f => String(f.id) === String(id));
  const sources = film?.sources || {};
  const tracks = film?.tracks || [];
  const defaultQualities = ["240p", "360p", "480p", "720p", "1080p"];
  const qualities = Object.keys(sources).length ? Object.keys(sources) : defaultQualities;
  const defaultSubs = ["Off"];
  const subtitles = tracks.length ? ["Off", ...tracks.map((t) => t.label)] : defaultSubs;

  // --- DEBUG LOGS ---
  console.log("film:", film);
  console.log("sources:", sources);
  console.log("currentQuality:", currentQuality);
  console.log("sources[currentQuality]:", sources[currentQuality]);
  console.log("film?.preview_url:", film?.preview_url);
  console.log("film?.previewUrl:", film?.previewUrl);
  console.log("film?.video_url:", film?.video_url);
  console.log("film?.videoUrl:", film?.videoUrl);

  const videoUrl =
    sources[currentQuality] ||
    film?.preview_url ||
    film?.previewUrl ||
    film?.video_url ||
    film?.videoUrl ||
    "";

  console.log("VIDEO URL =", videoUrl);

  // FORMAT TIME FUNC
  const fmt = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  // EFFECT: Debug
  useEffect(() => {
    if (!loading) {
      if (!film) {
        console.error("Film INEXISTENT!", id, films.map(f => f.id));
      } else {
        console.log("Film găsit:", film);
      }
    }
  }, [loading, film, id, films]);

  // EFFECT: Video events
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video) return;

    const onFullScreenChange = () => {
      setIsFullscreen(document.fullscreenElement === container);
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, []);

  // EFFECT: Quality/video url change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const wasPlaying = !video.paused;
    const time = video.currentTime;
    video.src = videoUrl;
    video.load();
    video.currentTime = time;
    if (wasPlaying) video.play();
    // eslint-disable-next-line
  }, [currentQuality, videoUrl]);

  // EFFECT: Hide/show controls
  useEffect(() => {
    let tid;
    const reset = () => {
      setShowControls(true);
      clearTimeout(tid);
      tid = setTimeout(() => setShowControls(false), 3000);
    };
    const cnt = containerRef.current;
    cnt?.addEventListener('mousemove', reset);
    cnt?.addEventListener('mouseleave', () => setShowControls(false));
    reset();
    return () => {
      clearTimeout(tid);
      cnt?.removeEventListener('mousemove', reset);
      cnt?.removeEventListener('mouseleave', () => setShowControls(false));
    };
  }, []);

  // === EARLY RETURN DUPĂ TOATE HOOK-URILE ===
  if (loading) return <div className="text-white p-10">Se încarcă filmele...</div>;
  if (!film) {
    return (
      <div className="text-white p-10">
        <b>Film inexistent.</b>
        <br /><br />
        <b>ID din URL:</b> {id}
        <br /><br />
        <b>ID-uri disponibile în baza de date:</b>
        <pre style={{ fontSize: 10, color: '#aaa', maxWidth: '100%' }}>{JSON.stringify(films.map(f => f.id), null, 2)}</pre>
      </div>
    );
  }

  // CONTROLS (mutate sub return pt. claritate)
  function togglePlay(e) {
    e.stopPropagation();
    const video = videoRef.current;
    const container = containerRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);  // instant update!
      setOverlayIcon('play');
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 500);
      if (!document.fullscreenElement && container.requestFullscreen) container.requestFullscreen();
    } else {
      video.pause();
      setIsPlaying(false); // instant update!
      setOverlayIcon('pause');
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 500);
    }
  }
  function handleSkip(sec) {
    videoRef.current.currentTime = Math.min(
      Math.max(videoRef.current.currentTime + sec, 0),
      duration
    );
  }
  function toggleMute() {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }
  function handleVolume(e) {
    const v = parseFloat(e.target.value);
    videoRef.current.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  }
  function handleSeek(e) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  }

  const btnClasses = "p-3 rounded-full hover:text-cyan-400 hover:scale-110 transform transition duration-150";

  // === RETURN PLAYER UI ===
  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen bg-black text-white ${isFullscreen && !showControls ? 'cursor-none' : 'cursor-auto'}`}
      onClick={togglePlay}
    >
      <video
  ref={videoRef}
  src={videoUrl}
  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
  autoPlay
  onTimeUpdate={() => {
    setCurrentTime(videoRef.current.currentTime);
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  }}
  onLoadedMetadata={() => setDuration(videoRef.current.duration)}
/>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            {overlayIcon === 'play'
              ? <Play size={100} className="text-cyan-400" />
              : <Pause size={100} className="text-cyan-400" />}
          </motion.div>
        )}
      </AnimatePresence>

      {showControls && (
        <button onClick={() => navigate(-1)} className={`${btnClasses} absolute top-5 right-5 bg-black/50 hover:bg-black`}><X size={28} /></button>
      )}

      <div
        className={`absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gray-700 rounded cursor-pointer relative mb-4" onClick={handleSeek}>
          <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${progress}%` }}>
            <div className="w-4 h-4 bg-red-600 rounded-full" />
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="flex items-center space-x-6">
            <button onClick={() => handleSkip(-10)} className={btnClasses}><SkipBack size={28} /></button>
            <button onClick={togglePlay} className={btnClasses}>{isPlaying ? <Pause size={36} /> : <Play size={36} />}</button>
            <button onClick={() => handleSkip(10)} className={btnClasses}><SkipForward size={28} /></button>
            <button onClick={toggleMute} className={btnClasses}><Volume2 size={28} /></button>
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={handleVolume} className="hidden sm:block w-32" />
            <span className="text-sm hidden sm:block">{fmt(currentTime)} / {fmt(duration)}</span>
          </div>

          <div className="absolute inset-x-0 text-center pointer-events-none">
            <span className="text-lg font-semibold truncate px-4">{film.title}</span>
          </div>

          <div className="ml-auto flex items-center space-x-6">
            <select value={currentQuality} onChange={(e) => setCurrentQuality(e.target.value)} className="bg-black/50 text-white px-3 py-1 rounded">
              {qualities.map((q) => (<option key={q} value={q}>{q}</option>))}
            </select>
            <button onClick={() => setShowSubsOptions(!showSubsOptions)} className={`${btnClasses} relative`}><Subtitles size={28} />
              {showSubsOptions && (
                <div className="absolute bottom-10 right-0 bg-black/50 rounded p-2 space-y-1">
                  {subtitles.map((sub) => (<div key={sub} onClick={() => setCurrentSubtitle(sub)} className="cursor-pointer hover:text-cyan-400">{sub}</div>))}
                </div>
              )}
            </button>
            <button onClick={toggleFullscreen} className={btnClasses}>{isFullscreen ? <Minimize2 size={28} /> : <Maximize2 size={28} />}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchPage;
