import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MoviesCard from '../components/MoviesCard'
import { useWatched } from '../context/WatchedContext'
import { Eye } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const History = () => {
  const { watched } = useWatched();
  const { themeClasses } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center gap-3 mb-8">
          <Eye className={`w-8 h-8 ${themeClasses.textSecondary}`} />
          <h1 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>Watched History</h1>
        </div>

        {watched.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Eye className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-300 mb-2">Your history is empty</p>
            <p className="text-gray-400">
              Movies you mark as watched will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
            {watched.map((movie) => (
              <div key={movie.id} className="relative group">
                <MoviesCard
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  url={movie.url}
                  rating={movie.rating}
                  genres={movie.genres}
                />
                {movie.watchedDate && (
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white backdrop-blur-sm z-10 pointer-events-none">
                    {new Date(movie.watchedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default History
