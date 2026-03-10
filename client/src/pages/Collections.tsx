import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MoviesCard from '../components/MoviesCard'
import { useCollections } from '../context/CollectionsContext'
import { Library, Plus, Trash2, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Collections = () => {
  const { collections, createCollection, deleteCollection, removeMovieFromCollection } = useCollections();
  const { themeClasses } = useTheme();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName, newCollectionDesc);
    setNewCollectionName('');
    setNewCollectionDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Library className={`w-8 h-8 ${themeClasses.textSecondary}`} />
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>My Collections</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`flex items-center gap-2 px-4 py-2 ${themeClasses.accent} text-white rounded-lg ${themeClasses.accentHover} transition-colors`}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Collection</span>
          </button>
        </div>

        {/* Collections List */}
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <Library className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-300 mb-2">No collections yet</p>
            <p className="text-gray-400">
              Create a collection to organize your favorite movies into custom lists.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {collections.map(collection => (
              <div key={collection.id} className={`bg-black/20 rounded-2xl p-6 border ${themeClasses.border}/20`}>
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h2 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-2`}>{collection.name}</h2>
                    {collection.description && (
                      <p className={`${themeClasses.textSecondary}`}>{collection.description}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">{collection.movies.length} movies</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this collection?')) {
                        deleteCollection(collection.id);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete collection"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {collection.movies.length === 0 ? (
                  <p className="text-gray-400 italic py-4">This collection is empty. Add movies from the movie details page!</p>
                ) : (
                  <div className={`flex gap-6 overflow-x-auto pb-6 scrollbar-thin ${themeClasses.scrollbar} scrollbar-track-transparent`}>
                    {collection.movies.map(movie => (
                      <div key={movie.id} className="flex-none w-[160px] sm:w-[200px] relative group">
                        <MoviesCard
                          id={movie.id}
                          title={movie.title}
                          year={movie.year}
                          url={movie.url}
                          rating={movie.rating}
                          genres={movie.genres}
                        />
                        <button
                          onClick={() => removeMovieFromCollection(collection.id, movie.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                          title="Remove from collection"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`bg-black border ${themeClasses.border}/30 rounded-2xl p-6 w-full max-w-md`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${themeClasses.textPrimary}`}>Create New Collection</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>Name *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCollectionName}
                    onChange={e => setNewCollectionName(e.target.value)}
                    className={`w-full bg-white/5 border ${themeClasses.border}/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-${themeClasses.accent.split('-')[1]}-500`}
                    placeholder="e.g., Sci-Fi Masterpieces"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>Description (Optional)</label>
                  <textarea
                    value={newCollectionDesc}
                    onChange={e => setNewCollectionDesc(e.target.value)}
                    rows={3}
                    className={`w-full bg-white/5 border ${themeClasses.border}/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-${themeClasses.accent.split('-')[1]}-500`}
                    placeholder="What is this collection about?"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 ${themeClasses.accent} text-white rounded-lg ${themeClasses.accentHover} transition-colors`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Collections
