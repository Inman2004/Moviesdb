import { Search, X, ArrowLeft, Heart, Menu, Bookmark, Palette, Eye, User, Library } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowMobileMenu(false);
      }
    };

    // Global keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Press '/' to focus search
        if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const searchInput = document.getElementById('global-search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape' && showMobileMenu) {
          setShowMobileMenu(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showMobileMenu]);

    const clearSearch = () => {
      setSearchQuery('');
    };
    
    const { setTheme, themeClasses } = useTheme();

  return (
    <div className={`header flex flex-col ${themeClasses.headerBg} w-full rounded-2xl min-h-fit transition-colors duration-300`}>
      <div className="flex justify-between items-center px-4 md:px-10 py-5">
        <div className="flex items-center gap-4">
          {!isHomePage && (
            <button
              onClick={() => navigate(-1)}
              className={`${themeClasses.textPrimary} hover:${themeClasses.textSecondary} transition-colors`}
              title="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className={`text-2xl md:text-4xl font-bold ${themeClasses.textPrimary} cursor-pointer`} onClick={() => navigate('/')}>MoviesDB</h1>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-6'>
          <div className='relative' ref={searchRef}>
            <div className='flex items-center gap-2'>
              <Search className={`${themeClasses.textSecondary}`} />
              <div className='relative'>
                <input
                  id="global-search-input"
                  type='text'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchSubmit}
                  placeholder='Search Movies (Press /)'
                  className={`w-60 h-10 rounded-2xl border-2 ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-${themeClasses.accent.split('-')[1]}-500 focus:ring-opacity-50 placeholder:${themeClasses.textPrimary}/60 ${themeClasses.textSecondary} px-2 pr-8 bg-white/50`}
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
          </div>
          <div className="relative group">
            <button className={`flex items-center gap-2 transition-colors mr-4 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary}`}>
              <Palette className="w-6 h-6" />
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg z-50">
              <button onClick={() => setTheme('amber')} className="w-6 h-6 rounded-full bg-amber-500 hover:scale-110 transition-transform"></button>
              <button onClick={() => setTheme('blue')} className="w-6 h-6 rounded-full bg-blue-500 hover:scale-110 transition-transform"></button>
              <button onClick={() => setTheme('purple')} className="w-6 h-6 rounded-full bg-purple-500 hover:scale-110 transition-transform"></button>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 transition-colors mr-4"
            title="View profile stats"
          >
            <User className={`w-6 h-6 ${themeClasses.textSecondary} hover:opacity-80`} />
          </button>
          <button
            onClick={() => navigate('/collections')}
            className="flex items-center gap-2 transition-colors mr-4"
            title="View collections"
          >
            <Library className={`w-6 h-6 ${themeClasses.textSecondary} hover:opacity-80`} />
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 transition-colors mr-4"
            title="View history"
          >
            <Eye className={`w-6 h-6 ${themeClasses.textSecondary} hover:opacity-80`} />
          </button>
          <button
            onClick={() => navigate('/watchlist')}
            className="flex items-center gap-2 transition-colors mr-4"
            title="View watchlist"
          >
            <Bookmark className={`w-6 h-6 ${themeClasses.textSecondary} fill-current hover:opacity-80`} />
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className="flex items-center gap-2 transition-colors"
            title="View favorites"
          >
            <Heart className={`w-6 h-6 ${themeClasses.textSecondary} fill-current hover:opacity-80`} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className={`md:hidden ${themeClasses.textPrimary} hover:${themeClasses.textSecondary} transition-colors p-2 rounded-lg hover:bg-white/20`}
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
          showMobileMenu ? `max-h-[80vh] border-t ${themeClasses.border}` : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-4">
          {/* Search Bar */}
          <div className='relative' ref={searchRef}>
            <div className='flex items-center gap-2 bg-white/50 rounded-2xl p-3 shadow-sm'>
              <Search className={`${themeClasses.textSecondary} w-5 h-5`} />
              <input
                type='text'
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                placeholder='Search Movies (Press Enter)'
                className={`w-full h-8 focus:outline-none ${themeClasses.textPrimary} placeholder:${themeClasses.textPrimary}/60 bg-transparent`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`${themeClasses.textSecondary} hover:opacity-70 p-1 rounded-full transition-colors`}
                  title='Clear search'
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-4 p-3 w-full justify-center">
            <button onClick={() => { setTheme('amber'); setShowMobileMenu(false); }} className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white"></button>
            <button onClick={() => { setTheme('blue'); setShowMobileMenu(false); }} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></button>
            <button onClick={() => { setTheme('purple'); setShowMobileMenu(false); }} className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></button>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => {
              navigate('/profile');
              setShowMobileMenu(false);
            }}
            className={`flex items-center gap-3 w-full p-3 ${themeClasses.textPrimary} hover:bg-white/30 rounded-2xl transition-colors`}
          >
            <User className="w-6 h-6" />
            <span className="font-medium">Profile Stats</span>
          </button>

          {/* Collections Button */}
          <button
            onClick={() => {
              navigate('/collections');
              setShowMobileMenu(false);
            }}
            className={`flex items-center gap-3 w-full p-3 ${themeClasses.textPrimary} hover:bg-white/30 rounded-2xl transition-colors`}
          >
            <Library className="w-6 h-6" />
            <span className="font-medium">Collections</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => {
              navigate('/history');
              setShowMobileMenu(false);
            }}
            className={`flex items-center gap-3 w-full p-3 ${themeClasses.textPrimary} hover:bg-white/30 rounded-2xl transition-colors`}
          >
            <Eye className="w-6 h-6" />
            <span className="font-medium">History</span>
          </button>

          {/* Watchlist Button */}
          <button
            onClick={() => {
              navigate('/watchlist');
              setShowMobileMenu(false);
            }}
            className={`flex items-center gap-3 w-full p-3 ${themeClasses.textPrimary} hover:bg-white/30 rounded-2xl transition-colors`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="font-medium">Watchlist</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => {
              navigate('/favorites');
              setShowMobileMenu(false);
            }}
            className={`flex items-center gap-3 w-full p-3 ${themeClasses.textPrimary} hover:bg-white/30 rounded-2xl transition-colors`}
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
