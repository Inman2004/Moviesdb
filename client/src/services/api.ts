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
  vote_count: number;
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

export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getTopRatedMovies = async (page: number = 1): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getNowPlayingMovies = async (page: number = 1): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const getUpcomingMovies = async (page: number = 1): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results);
};

export const searchMovies = async (query: string, page: number = 1): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`);
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

export const getMovieCredits = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  return data;
};

export const getMovieImages = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};

export const getMovieWatchProviders = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results?.US || null; // Defaulting to US for now
};

export const getPersonDetails = async (personId: number) => {
  const response = await fetch(`${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US`);
  return await response.json();
};

export const getPersonMovieCredits = async (personId: number) => {
  const response = await fetch(`${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.cast.slice(0, 20));
};

export const getSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results.slice(0, 10)); // return top 10 similar
};

export const getMovieRecommendations = async (movieId: number): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results.slice(0, 10)); // return top 10 recommendations
};

export const getMovieGenres = async (): Promise<Genre[]> => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  return data.genres;
};

export const discoverMovies = async (genreId?: number, sortBy: string = 'popularity.desc', page: number = 1): Promise<Movie[]> => {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=${sortBy}`;
  if (genreId) {
    url += `&with_genres=${genreId}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return fetchMoviesWithDetails(data.results.slice(0, 20)); // Return top 20
};