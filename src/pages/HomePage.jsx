import React from "react";
import Section from "../components/Section";
import films from "../data/films";
import HeroBanner from "../components/HeroBanner";
import TopFive from "../components/TopFive";

function HomePage() {
  return (
    <div className="space-y-10">
      <HeroBanner videoId="_VdhSW5UY5I" />
      <TopFive films={films} />
      <Section title="Continue Watching" items={films.slice(0, 4)} />
      <Section title="Period Pieces" items={films.slice(4, 8)} />
      <Section title="New on CinemAI" items={films.slice(8, 12)} />
      <Section title="TV Action & Adventure" items={films.slice(12, 16)} />
    </div>
  );
}

export default HomePage;
