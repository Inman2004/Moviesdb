import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Slider from '../components/Slider';
import MovieSection from '../components/MovieSection';
import Footer from '../components/Footer';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from '../services/api';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: string[];
}

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState({
    popular: true,
    topRated: true,
    nowPlaying: true,
    upcoming: true
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
        setLoading({
          popular: false,
          topRated: false,
          nowPlaying: false,
          upcoming: false
        });
      }
    };

    fetchAllMovies();
  }, []);

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
      </div>
      <Slider />
      <Footer />
    </div>
  );
}
