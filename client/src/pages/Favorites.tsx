import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MoviesCard from '../components/MoviesCard'
import { useFavorites } from '../context/FavoritesContext'
import { Heart } from 'lucide-react'

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-amber-900 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-300 mb-2">No favorites yet</p>
            <p className="text-gray-400">
              Start adding movies to your favorites by clicking the heart icon on any movie card
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
            {favorites.map((movie) => (
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

export default Favorites
