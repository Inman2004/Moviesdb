import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Slider from '../components/Slider';
import MovieSection from '../components/MovieSection';
import Footer from '../components/Footer';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, getMovieRecommendations, getMovieGenres, discoverMovies, getTrendingMovies } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import { Filter, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [discoveredMovies, setDiscoveredMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [trendingWindow, setTrendingWindow] = useState<'day' | 'week'>('day');

  const [loading, setLoading] = useState({
    popular: true,
    topRated: true,
    nowPlaying: true,
    upcoming: true,
    trending: true,
    recommended: false,
    discover: false,
  });

  const [pages, setPages] = useState({
    popular: 1,
    topRated: 1,
    nowPlaying: 1,
    upcoming: 1,
    trending: 1,
    discover: 1
  });

  const [loadingMore, setLoadingMore] = useState({
    popular: false,
    topRated: false,
    nowPlaying: false,
    upcoming: false,
    trending: false,
    discover: false
  });

  const { favorites } = useFavorites();
  const { watchlist } = useWatchlist();
  const { themeClasses } = useTheme();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getMovieGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchDiscovered = async () => {
      if (!selectedGenre && sortBy === 'popularity.desc') {
        setDiscoveredMovies([]);
        return;
      }
      try {
        setLoading(prev => ({ ...prev, discover: true }));
        setPages(prev => ({ ...prev, discover: 1 }));
        const movies = await discoverMovies(selectedGenre, sortBy, 1);
        setDiscoveredMovies(movies);
      } catch (error) {
        console.error("Error fetching discovered movies", error);
      } finally {
        setLoading(prev => ({ ...prev, discover: false }));
      }
    };
    fetchDiscovered();
  }, [selectedGenre, sortBy]);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        // Fetch all categories in parallel
        const [popular, topRated, nowPlaying, upcoming, trending] = await Promise.all([
          getPopularMovies(1),
          getTopRatedMovies(1),
          getNowPlayingMovies(1),
          getUpcomingMovies(1),
          getTrendingMovies(trendingWindow, 1)
        ]);

        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setNowPlayingMovies(nowPlaying);
        setUpcomingMovies(upcoming);
        setTrendingMovies(trending);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(prev => ({
          ...prev,
          popular: false,
          topRated: false,
          nowPlaying: false,
          upcoming: false,
          trending: false
        }));
      }
    };

    fetchAllMovies();
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(prev => ({ ...prev, trending: true }));
        setPages(prev => ({ ...prev, trending: 1 }));
        const movies = await getTrendingMovies(trendingWindow, 1);
        setTrendingMovies(movies);
      } catch (error) {
        console.error("Error fetching trending movies", error);
      } finally {
        setLoading(prev => ({ ...prev, trending: false }));
      }
    };
    // skip the initial fetch as it's handled by fetchAllMovies
    if (!loading.popular) {
        fetchTrending();
    }
  }, [trendingWindow]);

  const loadMore = async (category: keyof typeof pages) => {
    try {
      setLoadingMore(prev => ({ ...prev, [category]: true }));
      const nextPage = pages[category] + 1;

      let newMovies: Movie[] = [];
      switch (category) {
        case 'popular':
          newMovies = await getPopularMovies(nextPage);
          setPopularMovies(prev => [...prev, ...newMovies]);
          break;
        case 'topRated':
          newMovies = await getTopRatedMovies(nextPage);
          setTopRatedMovies(prev => [...prev, ...newMovies]);
          break;
        case 'nowPlaying':
          newMovies = await getNowPlayingMovies(nextPage);
          setNowPlayingMovies(prev => [...prev, ...newMovies]);
          break;
        case 'upcoming':
          newMovies = await getUpcomingMovies(nextPage);
          setUpcomingMovies(prev => [...prev, ...newMovies]);
          break;
        case 'trending':
          newMovies = await getTrendingMovies(trendingWindow, nextPage);
          setTrendingMovies(prev => [...prev, ...newMovies]);
          break;
        case 'discover':
          newMovies = await discoverMovies(selectedGenre, sortBy, nextPage);
          setDiscoveredMovies(prev => [...prev, ...newMovies]);
          break;
      }

      setPages(prev => ({ ...prev, [category]: nextPage }));
    } catch (error) {
      console.error(`Error loading more ${category} movies:`, error);
    } finally {
      setLoadingMore(prev => ({ ...prev, [category]: false }));
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Get a random movie from favorites or watchlist
      const combined = [...favorites, ...watchlist];
      if (combined.length === 0) return;

      const randomMovie = combined[Math.floor(Math.random() * combined.length)];

      try {
        setLoading(prev => ({ ...prev, recommended: true }));
        const recommendations = await getMovieRecommendations(randomMovie.id);
        setRecommendedMovies(recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(prev => ({ ...prev, recommended: false }));
      }
    };

    fetchRecommendations();
  }, [favorites, watchlist]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col transition-colors duration-300`}>
      <Header />

      {/* Filter and Sort Section */}
      <div className='container mx-auto px-4 pt-8'>
        <div className={`bg-black/40 p-4 rounded-xl backdrop-blur-sm border ${themeClasses.border} flex flex-wrap gap-4 items-center`}>
          <div className={`flex items-center gap-2 ${themeClasses.textSecondary} font-semibold mr-4`}>
            <Filter size={20} />
            <span>Discover</span>
          </div>

          <select
            className={`bg-black/50 text-white border ${themeClasses.border} rounded-lg px-4 py-2 focus:outline-none`}
            value={selectedGenre || ''}
            onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>

          <select
            className={`bg-black/50 text-white border ${themeClasses.border} rounded-lg px-4 py-2 focus:outline-none`}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Newest First</option>
            <option value="primary_release_date.asc">Oldest First</option>
          </select>

          {(selectedGenre || sortBy !== 'popularity.desc') && (
            <button
              onClick={() => { setSelectedGenre(undefined); setSortBy('popularity.desc'); }}
              className={`${themeClasses.textSecondary} hover:opacity-80 text-sm underline`}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 flex-grow'>
        {discoveredMovies.length > 0 ? (
          <MovieSection
            title="Discover Results"
            movies={discoveredMovies}
            loading={loading.discover}
            onLoadMore={() => loadMore('discover')}
            loadingMore={loadingMore.discover}
          />
        ) : (
          <>
            {/* Trending Section with Toggle */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <TrendingUp className={`w-8 h-8 ${themeClasses.textPrimary}`} />
                   <h2 className={`text-2xl md:text-3xl font-bold ${themeClasses.textPrimary}`}>Trending</h2>
                 </div>
                 <div className={`flex bg-black/40 rounded-full p-1 border ${themeClasses.border}/30`}>
                   <button
                     onClick={() => setTrendingWindow('day')}
                     className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${trendingWindow === 'day' ? `${themeClasses.accent} text-white` : `${themeClasses.textSecondary} hover:text-white`}`}
                   >
                     Today
                   </button>
                   <button
                     onClick={() => setTrendingWindow('week')}
                     className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${trendingWindow === 'week' ? `${themeClasses.accent} text-white` : `${themeClasses.textSecondary} hover:text-white`}`}
                   >
                     This Week
                   </button>
                 </div>
              </div>
              <MovieSection
                title=""
                movies={trendingMovies}
                loading={loading.trending}
                onLoadMore={() => loadMore('trending')}
                loadingMore={loadingMore.trending}
              />
            </div>

            {recommendedMovies.length > 0 && (
              <MovieSection
                title="Recommended For You"
                movies={recommendedMovies}
                loading={loading.recommended}
              />
            )}
            <MovieSection
              title="Popular Movies"
              movies={popularMovies}
              loading={loading.popular}
              onLoadMore={() => loadMore('popular')}
              loadingMore={loadingMore.popular}
            />
            <MovieSection
              title="Top Rated"
              movies={topRatedMovies}
              loading={loading.topRated}
              onLoadMore={() => loadMore('topRated')}
              loadingMore={loadingMore.topRated}
            />
            <MovieSection
              title="Now Playing"
              movies={nowPlayingMovies}
              loading={loading.nowPlaying}
              onLoadMore={() => loadMore('nowPlaying')}
              loadingMore={loadingMore.nowPlaying}
            />
            <MovieSection
              title="Upcoming Movies"
              movies={upcomingMovies}
              loading={loading.upcoming}
              onLoadMore={() => loadMore('upcoming')}
              loadingMore={loadingMore.upcoming}
            />
          </>
        )}
      </div>
      <Slider />
      <Footer />
    </div>
  );
}
