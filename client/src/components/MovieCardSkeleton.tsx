import React from 'react';

const MovieCardSkeleton = () => {
  return (
    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-amber-900/20 animate-pulse">
      {/* Poster skeleton */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-800/10 to-amber-900/20" />
      
      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        {/* Title skeleton */}
        <div className="h-6 bg-amber-500/20 rounded-md w-3/4 mx-auto" />
        
        {/* Rating skeleton */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-4 h-4 bg-amber-500/20 rounded-full" />
          <div className="w-8 h-4 bg-amber-500/20 rounded-md" />
        </div>
        
        {/* Year skeleton */}
        <div className="h-4 bg-amber-500/20 rounded-md w-1/3 mx-auto" />
        
        {/* Genre tags skeleton */}
        <div className="flex justify-center gap-2">
          <div className="h-6 bg-amber-500/20 rounded-full w-16" />
          <div className="h-6 bg-amber-500/20 rounded-full w-16" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-10 bg-amber-500/20 rounded-full w-24" />
          <div className="h-10 bg-amber-500/20 rounded-full w-10" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton; 