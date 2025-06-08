import React from "react";
import Section from "../components/Section";
import films from "../data/films";
import HeroBanner from "../components/HeroBanner";
import TopFive from "../components/TopFive";
import { useLocation } from "react-router-dom";

function HomePage() {
  const location = useLocation();

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
