const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Basic movie result from TMDB API
interface MovieResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

// Extended movie interface with additional details
interface Movie extends MovieResult {
  vote_average: number;
  genres: string[];
}

// Full movie details from TMDB API
export interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  runtime: number;
  tagline: string;
  backdrop_path: string;
  vote_average: number;
  genres: Genre[];
}

interface Genre {
  id: number;
  name: string;
}

const fetchMoviesWithDetails = async (movies: MovieResult[]): Promise<Movie[]> => {
  return Promise.all(
    movies.map(async (movie) => {
      const details = await getMovieDetails(movie.id);
      return {
        ...movie,
        vote_average: details.vote_average,
        genres: details.genres.map(g => g.name)
      };
    })
  );
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getUpcomingMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
  return await response.json();
};

export const getMovieVideos = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  return data.results;
};