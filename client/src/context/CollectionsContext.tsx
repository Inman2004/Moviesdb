import React, { createContext, useContext, useState, useEffect } from 'react';

interface Movie {
  id: number;
  title: string;
  year: number;
  url: string;
  rating?: number;
  genres?: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  movies: Movie[];
}

interface CollectionsContextType {
  collections: Collection[];
  createCollection: (name: string, description: string) => void;
  deleteCollection: (id: string) => void;
  addMovieToCollection: (collectionId: string, movie: Movie) => void;
  removeMovieFromCollection: (collectionId: string, movieId: number) => void;
  isMovieInCollection: (collectionId: string, movieId: number) => boolean;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('collections');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  const createCollection = (name: string, description: string) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      description,
      movies: []
    };
    setCollections(prev => [...prev, newCollection]);
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  const addMovieToCollection = (collectionId: string, movie: Movie) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId && !c.movies.some(m => m.id === movie.id)) {
        return { ...c, movies: [...c.movies, movie] };
      }
      return c;
    }));
  };

  const removeMovieFromCollection = (collectionId: string, movieId: number) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        return { ...c, movies: c.movies.filter(m => m.id !== movieId) };
      }
      return c;
    }));
  };

  const isMovieInCollection = (collectionId: string, movieId: number) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.movies.some(m => m.id === movieId) : false;
  };

  return (
    <CollectionsContext.Provider value={{
      collections,
      createCollection,
      deleteCollection,
      addMovieToCollection,
      removeMovieFromCollection,
      isMovieInCollection
    }}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};
