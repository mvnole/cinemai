import React from "react";
import Section from "../components/Section";
import HeroBanner from "../components/HeroBanner";
import TopFive from "../components/TopFive";
import { useLocation } from "react-router-dom";
import { useFilms } from "../hooks/useFilms";
import { useUserFavorites } from "../hooks/useFavorite";
import { useUser } from "../context/UserContext";

function HomePage() {
  const location = useLocation();
  const { films, loading } = useFilms();
  const { user } = useUser();
  const { favorites = [], loading: favLoading } = useUserFavorites(user?.id);

  if (loading || favLoading) return <div className="text-center py-12">Loading...</div>;
  if (!films.length) return <div className="text-center py-12">No films available.</div>;

  const myListFilms = films.filter(film => favorites.includes(film.id));

  return (
    <div className="space-y-10">
      <HeroBanner videoId="vubgCqWBRts" />
      <TopFive films={films} location={location} />

      <Section
        title="My List"
        items={myListFilms}
        location={location}
        favorites={favorites}
        showHeart
      />

      <Section title="Continue Watching" items={films.slice(0, 4)} location={location} favorites={favorites} showHeart />
      <Section title="Period Pieces" items={films.slice(4, 8)} location={location} favorites={favorites} showHeart />
      <Section title="New on CinemAI" items={films.slice(8, 12)} location={location} favorites={favorites} showHeart />
      <Section title="TV Action & Adventure" items={films.slice(12, 16)} location={location} favorites={favorites} showHeart />
    </div>
  );
}

export default HomePage;
