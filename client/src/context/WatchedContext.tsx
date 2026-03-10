import React, { createContext, useContext, useState, useEffect } from 'react';

interface Movie {
  id: number;
  title: string;
  year: number;
  url: string;
  rating?: number;
  genres?: string[];
  watchedDate?: string;
}

interface WatchedContextType {
  watched: Movie[];
  addToWatched: (movie: Movie) => void;
  removeFromWatched: (id: number) => void;
  isWatched: (id: number) => boolean;
  toggleWatched: (movie: Movie) => void;
}

const WatchedContext = createContext<WatchedContextType | undefined>(undefined);

export const WatchedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watched, setWatched] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('watched');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  const addToWatched = (movie: Movie) => {
    const movieWithDate = { ...movie, watchedDate: new Date().toISOString() };
    setWatched(prev => [movieWithDate, ...prev]);
  };

  const removeFromWatched = (id: number) => {
    setWatched(prev => prev.filter(movie => movie.id !== id));
  };

  const isWatched = (id: number) => {
    return watched.some(movie => movie.id === id);
  };

  const toggleWatched = (movie: Movie) => {
    if (isWatched(movie.id)) {
      removeFromWatched(movie.id);
    } else {
      addToWatched(movie);
    }
  };

  return (
    <WatchedContext.Provider value={{ watched, addToWatched, removeFromWatched, isWatched, toggleWatched }}>
      {children}
    </WatchedContext.Provider>
  );
};

export const useWatched = () => {
  const context = useContext(WatchedContext);
  if (context === undefined) {
    throw new Error('useWatched must be used within a WatchedProvider');
  }
  return context;
};
