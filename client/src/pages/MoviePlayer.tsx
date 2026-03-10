import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ReactPlayer from 'react-player/lazy'
import { getMovieDetails, getMovieVideos } from '../services/api'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, Star, Award, Users, Heart, Share2, Bookmark } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import { useWatchlist } from '../context/WatchlistContext'
import MovieSection from '../components/MovieSection'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'
import Reviews from '../components/Reviews'
import { Link } from 'react-router-dom'

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: string[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  vote_count: number;
}

interface MovieVideo {
  key: string;
  site: string;
  type: string;
}

const MoviePlayer = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { themeClasses } = useTheme();

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        window.scrollTo(0, 0); // scroll to top when movie changes
        const details = await getMovieDetails(Number(id));
        const videos = await getMovieVideos(Number(id));
        const credits = await getMovieCredits(Number(id));
        const similar = await getSimilarMovies(Number(id));
        
        setMovieDetails(() => details);
        setCast(credits.cast.slice(0, 10)); // Top 10 cast members
        setSimilarMovies(similar);
        
        // Find YouTube trailer
        const trailer = videos.find(
          (video: MovieVideo) => 
            video.site === "YouTube" && 
            (video.type === "Trailer" || video.type === "Teaser")
        );
        
        if (trailer) {
          setTrailer(`https://www.youtube.com/watch?v=${trailer.key}`);
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleFavoriteClick = () => {
    if (movieDetails) {
      toggleFavorite({
        id: movieDetails.id,
        title: movieDetails.title,
        year: new Date(movieDetails.release_date).getFullYear(),
        url: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
        rating: movieDetails.vote_average,
        genres: movieDetails.genres.map(g => g.name)
      });
    }
  };

  const handleWatchlistClick = () => {
    if (movieDetails) {
      toggleWatchlist({
        id: movieDetails.id,
        title: movieDetails.title,
        year: new Date(movieDetails.release_date).getFullYear(),
        url: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
        rating: movieDetails.vote_average,
        genres: movieDetails.genres.map(g => g.name)
      });
    }
  };

  const isMovieFavorite = movieDetails ? favorites.some(f => f.id === movieDetails.id) : false;
  const isMovieInWatchlist = movieDetails ? watchlist.some(f => f.id === movieDetails.id) : false;

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col`}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className={`w-32 h-32 ${themeClasses.accent}/20 rounded-full flex items-center justify-center`}>
              <div className={`w-24 h-24 ${themeClasses.accent}/40 rounded-full animate-spin`}></div>
            </div>
            <p className={`${themeClasses.textPrimary} mt-4 text-xl font-semibold`}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col`}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className={`${themeClasses.textPrimary} text-xl font-semibold animate-fade-in`}>Movie not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Video Player */}
          <div className="lg:w-2/3">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              {trailer ? (
                <div className="relative pt-[56.25%]">
                  <ReactPlayer
                    url={trailer}
                    width="100%"
                    height="100%"
                    controls={true}
                    className="absolute top-0 left-0"
                    style={{ aspectRatio: '16/9' }}
                    config={{
                      youtube: {
                        playerVars: {
                          modestbranding: 1,
                          rel: 0
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="relative pt-[56.25%] bg-black/50">
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <p className={`${themeClasses.textSecondary} text-lg`}>No trailer available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Movie Details */}
          <div className="lg:w-1/3 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{movieDetails?.title}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="p-2 rounded-full transition-all duration-300 bg-white hover:bg-gray-100"
                  title="Share movie"
                >
                  <Share2 className={`w-6 h-6 ${themeClasses.textSecondary}`} />
                </button>
                <button
                  onClick={handleWatchlistClick}
                  className={`p-2 rounded-full transition-all duration-300
                    ${isMovieInWatchlist ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white hover:bg-gray-100'}`}
                  aria-label={isMovieInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <Bookmark
                    className={`w-6 h-6 transition-colors duration-300
                      ${isMovieInWatchlist ? 'text-white fill-current' : 'text-blue-500'}`}
                  />
                </button>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full transition-all duration-300
                    ${isMovieFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-white hover:bg-gray-100'}`}
                  aria-label={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`w-6 h-6 transition-colors duration-300
                      ${isMovieFavorite ? 'text-white fill-current' : 'text-red-500'}`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                <span>{new Date(movieDetails?.release_date || '').getFullYear()}</span>
              </div>
              {movieDetails?.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                  <span>{movieDetails.runtime} min</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 ${themeClasses.textSecondary} fill-current`} />
                <span>{movieDetails?.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                <span>{movieDetails?.vote_count.toLocaleString()} votes</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movieDetails?.genres.map((genre) => (
                <span
                  key={genre.id}
                  className={`px-3 py-1 ${themeClasses.accent}/20 ${themeClasses.textSecondary} rounded-full text-sm`}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div>
              <h2 className={`text-xl font-semibold ${themeClasses.textSecondary} mb-3 flex items-center gap-2`}>
                <Award className="w-5 h-5" />
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {movieDetails?.overview}
              </p>
            </div>

            {cast.length > 0 && (
              <div className="mt-8">
                <h2 className={`text-xl font-semibold ${themeClasses.textSecondary} mb-4 flex items-center gap-2`}>
                  <Users className="w-5 h-5" />
                  Top Cast
                </h2>
                <div className={`flex gap-4 overflow-x-auto pb-4 scrollbar-thin ${themeClasses.scrollbar} scrollbar-track-transparent`}>
                  {cast.map(actor => (
                    <Link key={actor.id} to={`/person/${actor.id}`} className="flex-none w-24 text-center group cursor-pointer">
                      <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${themeClasses.border}/30 mb-2 group-hover:border-${themeClasses.accent.split('-')[1]}-500 transition-colors`}>
                        <img
                          src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x185?text=No+Image'}
                          alt={actor.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className={`text-sm font-medium text-white line-clamp-1 group-hover:${themeClasses.textPrimary} transition-colors`} title={actor.name}>{actor.name}</p>
                      <p className={`text-xs ${themeClasses.textSecondary}/80 line-clamp-1`} title={actor.character}>{actor.character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {similarMovies.length > 0 && (
          <div className={`mt-12 border-t ${themeClasses.border}/30 pt-8`}>
            <MovieSection title="Similar Movies" movies={similarMovies} loading={false} />
          </div>
        )}

        {/* Reviews Section */}
        {movieDetails && (
          <Reviews movieId={movieDetails.id} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MoviePlayer
