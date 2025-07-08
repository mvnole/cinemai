import React from "react";
import Section from "../components/Section";
import HeroBanner from "../components/HeroBanner";
import TopFive from "../components/TopFive";
import { useLocation } from "react-router-dom";
import { useFilms } from "../hooks/useFilms";
import { useUserFavorites } from "../hooks/useFavorite";
import { useUser } from "../context/UserContext";
import { useUserProgress } from "../hooks/useUserProgress";

function filterByGenre(films, genre) {
  // Acceptă atât genre ca string, cât și genres ca array
  return films.filter(film => {
    if (film.genre && typeof film.genre === "string") {
      return film.genre.toLowerCase().includes(genre.toLowerCase());
    }
    if (Array.isArray(film.genres)) {
      return film.genres.map(g => g.toLowerCase()).includes(genre.toLowerCase());
    }
    return false;
  });
}

function HomePage() {
  const location = useLocation();
  const { films, loading } = useFilms();
  const { user } = useUser();
  const { favorites = [], loading: favLoading } = useUserFavorites(user?.id);
  const { progressList, loading: progressLoading } = useUserProgress(user?.id);

  if (loading || favLoading || progressLoading)
    return <div className="text-center py-12">Loading...</div>;
  if (!films.length) return <div className="text-center py-12">No films available.</div>;

  const myListFilms = films.filter(film => favorites.includes(film.id));
  const continueWatchingIds = progressList.map(p => p.film_id);
  const continueWatchingFilms = films.filter(film => continueWatchingIds.includes(film.id));

  // Filtare categorii reale
  const sciFiFilms = filterByGenre(films, "Sci-Fi");
  const actionFilms = filterByGenre(films, "Action");
  const horrorFilms = filterByGenre(films, "Horror");

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

      <Section
        title="Continue Watching"
        items={continueWatchingFilms}
        location={location}
        favorites={favorites}
        showHeart
      />

      <Section
        title="Sci-Fi"
        items={sciFiFilms}
        location={location}
        favorites={favorites}
        showHeart
      />
      <Section
        title="Action"
        items={actionFilms}
        location={location}
        favorites={favorites}
        showHeart
      />
      <Section
        title="Horror"
        items={horrorFilms}
        location={location}
        favorites={favorites}
        showHeart
      />

      {/* Poți lăsa și categoriile vechi sau le poți scoate */}
      {/* <Section title="Period Pieces" ... /> */}
      {/* <Section title="New on CinemAI" ... /> */}
      {/* <Section title="TV Action & Adventure" ... /> */}
    </div>
  );
}

export default HomePage;
