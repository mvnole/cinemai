import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Search, Home, Film, Tv, User, Moon, Sun, Settings } from "lucide-react";

import dreamsPoster from "./assets/posters/dreams.jpg";
import eternalDawnPoster from "./assets/posters/eternal-dawn.jpg";
import automataPoster from "./assets/posters/automata.jpg";
import aiHunterPoster from "./assets/posters/ai-hunter.jpg";
import neonStormPoster from "./assets/posters/neon-storm.jpg";
import futureEdgePoster from "./assets/posters/future-edge.jpg";
import darkProtocolPoster from "./assets/posters/dark-protocol.jpg";
import digitalEdenPoster from "./assets/posters/digital-eden.jpg";
import quantumDriftPoster from "./assets/posters/quantum-drift.jpg";
import zeroHourPoster from "./assets/posters/zero-hour.jpg";
import spectrumPoster from "./assets/posters/spectrum.jpg";
import cyberDreamPoster from "./assets/posters/cyber-dream.jpg";
import silentCircuitPoster from "./assets/posters/silent-circuit.jpg";
import parallelPoster from "./assets/posters/parallel.jpg";
import skyHackerPoster from "./assets/posters/sky-hacker.jpg";
import aiHunterPreview from "./assets/previews/ai-hunter.mp4";

import { FilmPage } from "./components/FilmPage";

function FilmCard({ film, size }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/film/${film.id}`}
      className={`relative rounded overflow-hidden ${size === "small" ? "w-40" : "w-60"} aspect-[2/3] transition-transform duration-300 hover:scale-105`}
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
      <div className="absolute inset-0 bg-black z-0" />
      {film.previewUrl && isHovered ? (
        <video
          ref={videoRef}
          src={film.previewUrl}
          muted
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      ) : (
        <img
          src={film.image}
          alt={film.title}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}
      <div className="absolute bottom-0 w-full bg-black/70 text-white text-sm p-1 z-20">
        {film.title}
      </div>
    </Link>
  );
}

const films = [
  { id: "dreams", title: "Dreams", genre: "Sci-Fi", image: dreamsPoster, bgColor: "bg-gradient-to-r from-indigo-600 to-teal-500" },
  { id: "eternal-dawn", title: "Eternal Dawn", genre: "Action", image: eternalDawnPoster, bgColor: "bg-gradient-to-r from-orange-700 to-red-800" },
  { id: "automata", title: "Automata", genre: "Thriller", image: automataPoster, bgColor: "bg-gradient-to-r from-gray-400 to-gray-800" },
  { id: "ai-hunter", title: "AI Hunter", genre: "Drama", image: aiHunterPoster, previewUrl: aiHunterPreview, bgColor: "bg-gradient-to-r from-blue-900 to-lime-400" },
  { id: "neon-storm", title: "Neon Storm", genre: "Fantasy", image: neonStormPoster, bgColor: "bg-gradient-to-r from-purple-600 to-pink-500" },
  { id: "future-edge", title: "Future Edge", genre: "Sci-Fi", image: futureEdgePoster, bgColor: "bg-gradient-to-r from-cyan-400 to-black" },
  { id: "dark-protocol", title: "Dark Protocol", genre: "Mystery", image: darkProtocolPoster, bgColor: "bg-gradient-to-r from-blue-900 to-red-600" },
  { id: "digital-eden", title: "Digital Eden", genre: "Sci-Fi", image: digitalEdenPoster, bgColor: "bg-gradient-to-r from-emerald-500 to-yellow-300" },
  { id: "quantum-drift", title: "Quantum Drift", genre: "Adventure", image: quantumDriftPoster, bgColor: "bg-gradient-to-r from-red-700 to-blue-900" },
  { id: "zero-hour", title: "Zero Hour", genre: "Thriller", image: zeroHourPoster, bgColor: "bg-gradient-to-r from-gray-500 to-gray-700" },
  { id: "spectrum", title: "Spectrum", genre: "Drama", image: spectrumPoster, bgColor: "bg-gradient-to-r from-pink-500 via-yellow-300 to-indigo-600" },
  { id: "cyber-dream", title: "Cyber Dream", genre: "Sci-Fi", image: cyberDreamPoster, bgColor: "bg-gradient-to-r from-pink-700 to-black" },
  { id: "silent-circuit", title: "Silent Circuit", genre: "Mystery", image: silentCircuitPoster, bgColor: "bg-gradient-to-r from-lime-700 to-yellow-600" },
  { id: "parallel", title: "Parallel", genre: "Fantasy", image: parallelPoster, bgColor: "bg-gradient-to-r from-purple-200 to-sky-300" },
  { id: "sky-hacker", title: "Sky Hacker", genre: "Action", image: skyHackerPoster, bgColor: "bg-gradient-to-r from-blue-300 to-yellow-300" },
];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUsers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`flex h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <aside className="w-64 bg-zinc-900 p-4 flex flex-col gap-6">
          <h1 className="text-2xl font-bold">CinemAI</h1>
          <nav className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 hover:text-red-500"><Home size={20} /> Home</Link>
            <Link to="/movies" className="flex items-center gap-2 hover:text-red-500"><Film size={20} /> Movies</Link>
            <Link to="/tv-shows" className="flex items-center gap-2 hover:text-red-500"><Tv size={20} /> TV Shows</Link>
            <Link to="/search" className="flex items-center gap-2 hover:text-red-500"><Search size={20} /> Search</Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 space-y-10 relative">
          <div className="absolute top-4 right-6 flex items-center gap-4 z-50">
            <button onClick={toggleDarkMode} className="hover:scale-110 transition-transform">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowUsers(!showUsers)} className="hover:scale-110 transition-transform">
                <User size={24} />
              </button>
              <div className={`absolute right-0 mt-2 bg-zinc-800 text-white rounded shadow-lg w-48 p-4 transition-all duration-300 ease-in-out transform origin-top ${showUsers ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`} style={{ transformOrigin: "top" }}>
                <h3 className="font-semibold mb-2">Users</h3>
                <ul className="space-y-2">
                  <li>User 1</li>
                  <li>User 2</li>
                  <li>User 3</li>
                  <li>User 4</li>
                  <li>User 5</li>
                </ul>
                <hr className="my-2 border-zinc-600" />
                <button className="w-full text-left hover:text-red-400">Log Out</button>
                <button className="mt-2 flex items-center gap-2 text-sm hover:text-blue-400">
                  <Settings size={16} /> Settings
                </button>
              </div>
            </div>
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <div className="space-y-10">
                  <Section title="Continue Watching" items={films.slice(0, 4)} />
                  <Section title="Period Pieces" items={films.slice(4, 8)} />
                  <Section title="New on CinemAI" items={films.slice(8, 12)} />
                  <Section title="TV Action & Adventure" items={films.slice(12, 16)} />
                </div>
              }
            />
            <Route path="/film/:id" element={<OutsideClickWrapper><FilmPage films={films} /></OutsideClickWrapper>} />
            <Route path="/movies" element={<h2 className="text-xl">Movies Page (în lucru)</h2>} />
            <Route path="/tv-shows" element={<h2 className="text-xl">TV Shows Page (în lucru)</h2>} />
            <Route path="/search" element={<h2 className="text-xl">Search Page (în lucru)</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function OutsideClickWrapper({ children }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        navigate("/");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div ref={wrapperRef} className="bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        {children}
      </div>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto">
        {items.map((film) => (
          <FilmCard key={film.id} film={film} size="small" />
        ))}
      </div>
    </div>
  );
}

export default App;
