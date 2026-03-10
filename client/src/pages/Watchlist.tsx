import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MoviesCard from '../components/MoviesCard'
import { useWatchlist } from '../context/WatchlistContext'
import { Bookmark } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Watchlist = () => {
  const { watchlist } = useWatchlist();
  const { themeClasses } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className={`w-8 h-8 ${themeClasses.textSecondary} fill-current`} />
          <h1 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>My Watchlist</h1>
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-300 mb-2">Your watchlist is empty</p>
            <p className="text-gray-400">
              Save movies to watch later by clicking the bookmark icon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
            {watchlist.map((movie) => (
              <MoviesCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                url={movie.url}
                rating={movie.rating}
                genres={movie.genres}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Watchlist
