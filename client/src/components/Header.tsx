import { Search, X, ArrowLeft, Heart, Menu } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { searchMovies } from '../services/api';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

// Custom debounce function
const debounce = <F extends (query: string) => Promise<void>>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (query: string): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(query), waitFor);
  };
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const isHomePage = location.pathname === '/';

    // Close mobile menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
          setShowMobileMenu(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
      setShowMobileMenu(false);
    }, [location.pathname]);

    // Debounced search function
    const debouncedSearch = debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        const results = await searchMovies(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setShowResults(true);
      setLoading(true);
      debouncedSearch(query);
    };

    const handleMovieClick = (movieId: number) => {
      setShowResults(false);
      setSearchQuery('');
      navigate(`/movie/${movieId}`);
    };

    const clearSearch = () => {
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);
    };
    
  return (
    <div className='header flex flex-col bg-amber-200 w-full rounded-2xl min-h-fit'>
      <div className="flex justify-between items-center px-4 md:px-10 py-5">
        <div className="flex items-center gap-4">
          {!isHomePage && (
            <button
              onClick={() => navigate(-1)}
              className="text-amber-900 hover:text-amber-700 transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className='text-2xl md:text-4xl font-bold text-amber-900 cursor-pointer' onClick={() => navigate('/')}>MoviesDB</h1>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-6'>
          <div className='relative' ref={searchRef}>
            <div className='flex items-center gap-2'>
              <Search className='text-amber-700' />
              <div className='relative'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder='Search Movies'
                  className='w-60 h-10 rounded-2xl border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 placeholder:text-amber-900/60 text-amber-700 px-2 pr-8 bg-amber-100'
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    title='Clear search'
                    aria-label='Clear search'
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && (searchResults.length > 0 || loading) && (
              <div className='absolute mt-2 w-72 max-h-96 overflow-y-auto bg-amber-50 rounded-lg shadow-lg z-50'>
                {loading ? (
                  <div className='p-4 text-center text-gray-500'>Loading...</div>
                ) : (
                  searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className='flex items-center gap-3 p-2 hover:bg-amber-50 cursor-pointer'
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/no-poster.png'}
                        alt={movie.title}
                        className='w-10 h-14 object-cover rounded'
                      />
                      <div>
                        <p className='font-medium text-gray-800'>{movie.title}</p>
                        <p className='text-sm text-gray-500'>
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/favorites')}
            className="flex items-center gap-2  transition-colors"
            title="View favorites"
          >
            <Heart className="w-6 h-6 text-amber-600 fill-amber-600 hover:fill-amber-700" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden text-amber-900 hover:text-amber-700 transition-colors p-2 rounded-lg hover:bg-amber-200"
          aria-label="Toggle mobile menu"
          title="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          showMobileMenu ? 'max-h-[80vh] border-t border-amber-200' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-4">
          {/* Search Bar */}
          <div className='relative' ref={searchRef}>
            <div className='flex items-center gap-2 bg-amber-200 rounded-2xl p-3 shadow-sm'>
              <Search className='text-amber-700 w-5 h-5' />
              <input
                type='text'
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder='Search Movies'
                className='w-full h-8 focus:outline-none text-amber-700 placeholder:text-amber-900/60 bg-amber-200'
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className='text-amber-500 bg-amber-200 hover:text-gray-700 p-1 hover:bg-amber-100 rounded-full transition-colors'
                  title='Clear search'
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Mobile Search Results with Smooth Animation */}
            <div className={`absolute left-0 right-0 mt-2 transition-all duration-300 ${
              showResults && (searchResults.length > 0 || loading)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}>
              <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                {loading ? (
                  <div className='p-4 text-center text-gray-500'>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto"></div>
                  </div>
                ) : (
                  searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className='flex items-center gap-3 p-3 hover:bg-amber-50 cursor-pointer active:bg-amber-100 transition-colors'
                      onClick={() => {
                        handleMovieClick(movie.id);
                        setShowMobileMenu(false);
                      }}
                    >
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/no-poster.png'}
                        alt={movie.title}
                        className='w-12 h-16 object-cover rounded shadow-sm'
                      />
                      <div>
                        <p className='font-medium text-gray-800 line-clamp-2'>{movie.title}</p>
                        <p className='text-sm text-gray-500'>
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Favorites Button */}
          <button
            onClick={() => {
              navigate('/favorites');
              setShowMobileMenu(false);
            }}
            className="flex items-center gap-3 w-full p-3 text-amber-900 hover:bg-amber-200 rounded-2xl transition-colors active:bg-amber-300"
          >
            <Heart className="w-6 h-6" />
            <span className="font-medium">Favorites</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
