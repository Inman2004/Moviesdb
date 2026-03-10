import React, { useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useWatched } from '../context/WatchedContext'
import { useFavorites } from '../context/FavoritesContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useTheme } from '../context/ThemeContext'
import { Activity, Clock, Film, Heart, Bookmark, Trophy, BarChart2 } from 'lucide-react'

const Profile = () => {
  const { watched } = useWatched();
  const { favorites } = useFavorites();
  const { watchlist } = useWatchlist();
  const { themeClasses } = useTheme();

  const stats = useMemo(() => {
    const totalWatched = watched.length;
    const totalFavorites = favorites.length;
    const totalWatchlist = watchlist.length;

    // Calculate top genres
    const genreCounts: { [key: string]: number } = {};
    watched.forEach(movie => {
      movie.genres?.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Calculate this month's watches
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const watchesThisMonth = watched.filter(movie => {
      if (!movie.watchedDate) return false;
      const date = new Date(movie.watchedDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    return {
      totalWatched,
      totalFavorites,
      totalWatchlist,
      topGenres: sortedGenres,
      watchesThisMonth
    };
  }, [watched, favorites, watchlist]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow animate-fade-in">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <div className={`p-3 rounded-full ${themeClasses.accent}/20`}>
            <Activity className={`w-8 h-8 ${themeClasses.textPrimary}`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>Your Profile Stats</h1>
            <p className={`${themeClasses.textSecondary}`}>Track your movie watching habits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stat Cards */}
          <div className={`bg-black/30 p-6 rounded-2xl border ${themeClasses.border}/30 hover:border-${themeClasses.accent.split('-')[1]}-500/50 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${themeClasses.textSecondary} font-semibold`}>Total Watched</h3>
              <Film className={`w-6 h-6 ${themeClasses.textPrimary}`} />
            </div>
            <p className={`text-4xl font-bold ${themeClasses.textPrimary}`}>{stats.totalWatched}</p>
          </div>

          <div className={`bg-black/30 p-6 rounded-2xl border ${themeClasses.border}/30 hover:border-${themeClasses.accent.split('-')[1]}-500/50 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${themeClasses.textSecondary} font-semibold`}>Favorites</h3>
              <Heart className={`w-6 h-6 ${themeClasses.textPrimary} fill-current`} />
            </div>
            <p className={`text-4xl font-bold ${themeClasses.textPrimary}`}>{stats.totalFavorites}</p>
          </div>

          <div className={`bg-black/30 p-6 rounded-2xl border ${themeClasses.border}/30 hover:border-${themeClasses.accent.split('-')[1]}-500/50 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${themeClasses.textSecondary} font-semibold`}>Watchlist</h3>
              <Bookmark className={`w-6 h-6 ${themeClasses.textPrimary} fill-current`} />
            </div>
            <p className={`text-4xl font-bold ${themeClasses.textPrimary}`}>{stats.totalWatchlist}</p>
          </div>

          <div className={`bg-black/30 p-6 rounded-2xl border ${themeClasses.border}/30 hover:border-${themeClasses.accent.split('-')[1]}-500/50 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${themeClasses.textSecondary} font-semibold`}>This Month</h3>
              <Clock className={`w-6 h-6 ${themeClasses.textPrimary}`} />
            </div>
            <p className={`text-4xl font-bold ${themeClasses.textPrimary}`}>{stats.watchesThisMonth}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Genres */}
          <div className={`bg-black/30 p-8 rounded-3xl border ${themeClasses.border}/30`}>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className={`w-6 h-6 ${themeClasses.textPrimary}`} />
              <h2 className={`text-2xl font-bold ${themeClasses.textPrimary}`}>Top Genres</h2>
            </div>

            {stats.topGenres.length > 0 ? (
              <div className="space-y-4">
                {stats.topGenres.map(([genre, count], index) => {
                  // Calculate percentage for progress bar (relative to the top genre)
                  const maxCount = stats.topGenres[0][1];
                  const percentage = (count / maxCount) * 100;

                  return (
                    <div key={genre} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-medium">{genre}</span>
                        <span className={`${themeClasses.textSecondary}`}>{count} movies</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${themeClasses.accent} rounded-full`}
                          style={{ width: `${percentage}%`, opacity: 1 - (index * 0.15) }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`${themeClasses.textSecondary} text-center py-8`}>
                Watch some movies to see your favorite genres!
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className={`bg-black/30 p-8 rounded-3xl border ${themeClasses.border}/30`}>
             <div className="flex items-center gap-3 mb-6">
              <BarChart2 className={`w-6 h-6 ${themeClasses.textPrimary}`} />
              <h2 className={`text-2xl font-bold ${themeClasses.textPrimary}`}>Recent Activity</h2>
            </div>

            {watched.length > 0 ? (
              <div className="space-y-6">
                {watched.slice(0, 5).map(movie => (
                  <div key={movie.id} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <img
                      src={movie.url}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded shadow-md"
                    />
                    <div className="flex-grow">
                      <h4 className="text-white font-medium line-clamp-1">{movie.title}</h4>
                      <p className={`text-sm ${themeClasses.textSecondary}`}>
                        Watched on {movie.watchedDate ? new Date(movie.watchedDate).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${themeClasses.textSecondary} text-center py-8`}>
                No recent activity to display.
              </p>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Profile
