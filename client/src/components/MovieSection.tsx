import React from 'react';
import MoviesCard from './MoviesCard';
import LoadingSpinner from './LoadingSpinner';
import MovieCardSkeleton from './MovieCardSkeleton';
import { useTheme } from '../context/ThemeContext'

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: string[];
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading: boolean;
  id?: string;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

const MovieSection = ({ title, movies, loading, id, onLoadMore, loadingMore }: MovieSectionProps) => {
  const { themeClasses } = useTheme();

  // Loading state
  if (loading) {
    return (
      <section id={id} className="mb-12 scroll-mt-24">
        <h2 className={`text-2xl font-bold mb-6 ${themeClasses.textPrimary}`}>{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
        <div className="mt-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  // Error state for invalid data
  if (!Array.isArray(movies)) {
    console.error(`Invalid movies data for section: ${title}`);
    return null;
  }

  // Empty state
  if (!movies.length) {
    return (
      <section id={id} className="mb-12 scroll-mt-24">
        <h2 className={`text-2xl font-bold mb-6 ${themeClasses.textPrimary}`}>{title}</h2>
        <div className={`text-center ${themeClasses.textSecondary} py-8`}>
          No movies available in this section.
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className={`text-2xl font-bold mb-6 ${themeClasses.textPrimary}`}>{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
        {movies.map((movie) => (
          <MoviesCard
            key={`${movie.id}-${Math.random()}`} // random suffix for duplicates from multiple pages if any
            id={movie.id}
            title={movie.title}
            year={new Date(movie.release_date).getFullYear()}
            url={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            rating={movie.vote_average}
            genres={movie.genres}
          />
        ))}
      </div>

      {onLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className={`px-8 py-3 ${themeClasses.accent} text-white rounded-full ${themeClasses.accentHover} font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {loadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : 'Load More'}
          </button>
        </div>
      )}
    </section>
  );
};

export default MovieSection; 