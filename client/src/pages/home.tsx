import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Slider from '../components/Slider';
import MovieSection from '../components/MovieSection';
import Footer from '../components/Footer';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, getMovieRecommendations } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genres: string[];
}

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const { favorites } = useFavorites();
  const [loading, setLoading] = useState({
    popular: true,
    topRated: true,
    nowPlaying: true,
    upcoming: true,
    recommended: true
  });

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        // Fetch all categories in parallel
        const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies(),
          getUpcomingMovies()
        ]);

        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setNowPlayingMovies(nowPlaying);
        setUpcomingMovies(upcoming);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(prev => ({
          ...prev,
          popular: false,
          topRated: false,
          nowPlaying: false,
          upcoming: false
        }));
      }
    };

    fetchAllMovies();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (favorites.length === 0) {
        setRecommendedMovies([]);
        setLoading(prev => ({ ...prev, recommended: false }));
        return;
      }

      try {
        setLoading(prev => ({ ...prev, recommended: true }));
        const recommendations = await Promise.all(
          favorites.map(fav => getMovieRecommendations(fav.id))
        );

        // Flatten, remove duplicates, and exclude already favorited movies
        const allRecs = recommendations.flat();
        const uniqueRecs = Array.from(new Map(allRecs.map(m => [m.id, m])).values());
        const filteredRecs = uniqueRecs.filter(rec => !favorites.some(fav => fav.id === rec.id));

        setRecommendedMovies(filteredRecs);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(prev => ({ ...prev, recommended: false }));
      }
    };

    fetchRecommendations();
  }, [favorites]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-amber-900 flex flex-col'>
      <Header />
      <div className='container mx-auto px-4 py-8 flex-grow'>
        <MovieSection
          title="Popular Movies"
          movies={popularMovies}
          loading={loading.popular}
        />
        <MovieSection
          title="Top Rated"
          movies={topRatedMovies}
          loading={loading.topRated}
        />
        <MovieSection
          title="Now Playing"
          movies={nowPlayingMovies}
          loading={loading.nowPlaying}
        />
        <MovieSection
          title="Upcoming Movies"
          movies={upcomingMovies}
          loading={loading.upcoming}
        />
        {favorites.length > 0 && (
          <MovieSection
            title="Recommended for You"
            movies={recommendedMovies}
            loading={loading.recommended}
          />
        )}
      </div>
      <Slider movies={recommendedMovies.length > 0 ? recommendedMovies : popularMovies} />
      <Footer />
    </div>
  );
}
