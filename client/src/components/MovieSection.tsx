import React from 'react';
import MoviesCard from './MoviesCard';
import LoadingSpinner from './LoadingSpinner';
import MovieCardSkeleton from './MovieCardSkeleton';

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
}

const MovieSection = ({ title, movies, loading, id }: MovieSectionProps) => {
  // Loading state
  if (loading) {
    return (
      <section id={id} className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-amber-100">{title}</h2>
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
        <h2 className="text-2xl font-bold mb-6 text-amber-100">{title}</h2>
        <div className="text-center text-amber-200 py-8">
          No movies available in this section.
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 text-amber-100">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MoviesCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            year={new Date(movie.release_date).getFullYear()}
            url={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            rating={movie.vote_average}
            genres={movie.genres}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieSection; 