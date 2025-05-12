const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: string[];
}

export interface MovieDetails extends Movie {
  overview: string;
  runtime: number;
  tagline: string;
  backdrop_path: string;
}

interface Genre {
    id: number;
    name: string;
}

const fetchMoviesWithDetails = async (movies: MovieResult[]) => {
    return Promise.all(
        movies.map(async (movie) => {
            const details = await getMovieDetails(movie.id)
            return {
                ...movie,
                vote_average: details.vote_average,
                genres: details.genres.map((g: Genre) => g.name)
            }
        })
    )
}

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
    const data = await response.json()
    return fetchMoviesWithDetails(data.results)
}

export const getTopRatedMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
    const data = await response.json()
    return fetchMoviesWithDetails(data.results)
}

export const getNowPlayingMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`)
    const data = await response.json()
    return fetchMoviesWithDetails(data.results)
}

export const getUpcomingMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`)
    const data = await response.json()
    return fetchMoviesWithDetails(data.results)
}

export const searchMovies = async (query: string) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`)
    const data = await response.json()
    return fetchMoviesWithDetails(data.results)
}

export const getMovieDetails = async (movieId: number) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`)
    return await response.json()
}

export const getMovieVideos = async (movieId: number) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`)
    const data = await response.json()
    return data.results
}