import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MovieSection from '../components/MovieSection'
import { searchMovies } from '../services/api'
import { useSearchParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Search } from 'lucide-react'

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  interface Movie {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
    vote_average: number;
    genres: string[];
  }

  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const { themeClasses } = useTheme();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setPage(1);
        const movies = await searchMovies(query, 1);
        setResults(movies);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleLoadMore = async () => {
    if (!query) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const moreMovies = await searchMovies(query, nextPage);
      setResults(prev => [...prev, ...moreMovies]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more search results:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center gap-3 mb-8">
          <Search className={`w-8 h-8 ${themeClasses.textSecondary}`} />
          <h1 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>
            {query ? `Search Results for "${query}"` : 'Search Movies'}
          </h1>
        </div>

        {!query ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-300 mb-2">Start typing to search</p>
            <p className="text-gray-400">
              Find your favorite movies using the search bar above.
            </p>
          </div>
        ) : loading ? (
           <MovieSection title="" movies={[]} loading={true} />
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xl text-gray-300 mb-2">No results found for "{query}"</p>
            <p className="text-gray-400">
              Try adjusting your search term.
            </p>
          </div>
        ) : (
          <MovieSection
            title=""
            movies={results}
            loading={false}
            onLoadMore={handleLoadMore}
            loadingMore={loadingMore}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SearchPage
