import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ReactPlayer from 'react-player/lazy'
import { getMovieDetails, getMovieVideos } from '../services/api'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, Star, Award, Users, Heart } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

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
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const details = await getMovieDetails(Number(id));
        const videos = await getMovieVideos(Number(id));
        
        setMovieDetails(details);
        
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

  const isMovieFavorite = movieDetails ? favorites.some(f => f.id === movieDetails.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-amber-900 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 bg-amber-500/20 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-amber-500/40 rounded-full animate-spin"></div>
            </div>
            <p className="text-amber-500 mt-4 text-xl font-semibold">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-amber-900 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-amber-500 text-xl font-semibold animate-fade-in">Movie not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-amber-500 flex flex-col">
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
                <div className="relative pt-[56.25%] bg-amber-900/50">
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <p className="text-amber-400 text-lg">No trailer available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Movie Details */}
          <div className="lg:w-1/3 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{movieDetails?.title}</h1>
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

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>{new Date(movieDetails?.release_date || '').getFullYear()}</span>
              </div>
              {movieDetails?.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>{movieDetails.runtime} min</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{movieDetails?.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>{movieDetails?.vote_count.toLocaleString()} votes</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movieDetails?.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {movieDetails?.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MoviePlayer
