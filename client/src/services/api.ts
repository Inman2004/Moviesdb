const API_KEY = "34f6f8c93478241fd62b62fe77d58dad"
const BASE_URL = "https://api.themoviedb.org/3"

interface MovieResult {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
}

interface Genre {
    id: number;
    name: string;
}

interface MovieDetails {
    id: number;
    vote_average: number;
    genres: Genre[];
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