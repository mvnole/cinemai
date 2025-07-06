import React from "react";
import Section from "../components/Section";
import HeroBanner from "../components/HeroBanner";
import TopFive from "../components/TopFive";
import { useLocation } from "react-router-dom";
import { useFilms } from "../hooks/useFilms";

function HomePage() {
  const location = useLocation();
  const { films, loading } = useFilms();

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!films.length) return <div className="text-center py-12">No films available.</div>;

  return (
    <div className="space-y-10">
      <HeroBanner videoId="_VdhSW5UY5I" />
      <TopFive films={films} location={location} />
      <Section title="Continue Watching" items={films.slice(0, 4)} location={location} />
      <Section title="Period Pieces" items={films.slice(4, 8)} location={location} />
      <Section title="New on CinemAI" items={films.slice(8, 12)} location={location} />
      <Section title="TV Action & Adventure" items={films.slice(12, 16)} location={location} />
    </div>
  );
}

export default HomePage;
