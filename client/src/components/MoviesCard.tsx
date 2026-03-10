import { Heart, X, Star, Bookmark } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

interface MovieProps {
  id: number;
  title: string;
  year: number;
  url: string;
  rating?: number;
  genres?: string[];
}

const MoviesCard = ({ id, title, year, url, rating, genres }: MovieProps) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { inWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isMovieFavorite = isFavorite(id);
  const isMovieInWatchlist = inWatchlist(id);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { themeClasses } = useTheme();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    if (isMobile && !isOverlayVisible) {
      e.preventDefault();
      setIsOverlayVisible(true);
    } else {
      navigate(`/movie/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMovieFavorite) {
      removeFavorite(id);
    } else {
      addFavorite({ id, title, year, url, rating, genres });
    }
    
    toast.custom((t) => (
      <div className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md bg-gradient-to-r from-amber-50 to-amber-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-16 w-12 rounded-md object-cover shadow-sm"
                src={url}
                alt={title}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-amber-900">
                {title}
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {isMovieFavorite ? 'Removed from favorites' : 'Added to favorites'}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex items-center">
              <Heart className={`w-6 h-6 ${isMovieFavorite ? 'text-gray-400' : 'fill-red-500 text-red-500'}`} />
            </div>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex border border-transparent rounded-none rounded-r-lg p-4 items-center justify-center text-sm font-medium text-amber-600 hover:text-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ), {
      duration: 3000,
      position: 'bottom-right',
    });
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMovieInWatchlist) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist({ id, title, year, url, rating, genres });
    }

    toast.custom((t) => (
      <div className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md bg-gradient-to-r from-amber-50 to-amber-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-16 w-12 rounded-md object-cover shadow-sm"
                src={url}
                alt={title}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-amber-900">
                {title}
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {isMovieInWatchlist ? 'Removed from watchlist' : 'Added to watchlist'}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex items-center">
              <Bookmark className={`w-6 h-6 ${isMovieInWatchlist ? 'text-gray-400' : 'fill-blue-500 text-blue-500'}`} />
            </div>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex border border-transparent rounded-none rounded-r-lg p-4 items-center justify-center text-sm font-medium text-amber-600 hover:text-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ), {
      duration: 3000,
      position: 'bottom-right',
    });
  };

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.movie-card')) {
        setIsOverlayVisible(false);
      }
    };

    if (isMobile && isOverlayVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isOverlayVisible]);

  return (
    <div 
      className={`movie-card relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg group 
        transform transition-all duration-300
        ${!isMobile ? 'hover:scale-105' : ''}`}
      onClick={handleCardClick}
      role="button"
      aria-label={`View details for ${title}`}
    >
      {/* Poster Image */}
      <img 
        src={url} 
        alt={title}
        className='w-full h-full object-cover'
        loading='lazy'
      />

      {/* Overlay Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-t ${themeClasses.bgGradient.replace('from-black', '')}/95 via-black/50 to-transparent
        transition-opacity duration-300
        ${isMobile 
          ? isOverlayVisible ? 'opacity-100' : 'opacity-0'
          : 'opacity-0 group-hover:opacity-100'
        }`}
      />

      {/* Content Container */}
      <div className={`absolute inset-0 p-4 flex flex-col justify-between
        transition-all duration-300
        ${isMobile
          ? isOverlayVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
          : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {/* Movie Info Section */}
        <div className='flex-1 flex flex-col items-center justify-center space-y-3'>
          <h2 className='movie-title text-lg font-semibold text-white text-center line-clamp-2 mb-1'>
            {title}
          </h2>
          
          {/* Rating */}
          {rating && (
            <div className='flex items-center gap-1.5'>
              <Star className={`w-5 h-5 ${themeClasses.textSecondary} fill-current`} />
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                {rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Year */}
          <p className='text-sm text-gray-300'>
            {year}
          </p>

          {/* Genres */}
          {genres && genres.length > 0 && (
            <div className='flex flex-wrap justify-center gap-2'>
              {genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className={`px-2.5 py-1 text-xs ${themeClasses.accent}/20 ${themeClasses.textSecondary} rounded-full`}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex items-center justify-center gap-2 mt-4'>
          <button 
            className={`movie-btn px-4 py-2.5 ${themeClasses.accent} text-white rounded-full
              ${themeClasses.accentHover}
              transition-colors duration-300 shadow-lg flex items-center justify-center min-w-[80px]
              focus:outline-none`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${id}`);
            }}
          >
            Watch
          </button>
          <button 
            className={`fav-btn p-2 rounded-full transition-all duration-300 shadow-lg
              ${isMovieInWatchlist
                ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                : 'bg-white hover:bg-gray-100 active:bg-gray-200'}
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isMovieInWatchlist ? 'focus:ring-blue-500' : 'focus:ring-gray-500'}`}
            onClick={handleWatchlistClick}
            aria-label={isMovieInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Bookmark
              className={`w-5 h-5 transition-colors duration-300
                ${isMovieInWatchlist
                  ? 'text-white fill-current'
                  : 'text-blue-500'}`}
            />
          </button>
          <button
            className={`fav-btn p-2 rounded-full transition-all duration-300 shadow-lg
              ${isMovieFavorite 
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
                : 'bg-white hover:bg-gray-100 active:bg-gray-200'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${isMovieFavorite ? 'focus:ring-red-500' : 'focus:ring-gray-500'}`} 
            onClick={handleFavoriteClick}
            aria-label={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              className={`w-5 h-5 transition-colors duration-300 
                ${isMovieFavorite 
                  ? 'text-white fill-current' 
                  : 'text-red-500'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoviesCard
