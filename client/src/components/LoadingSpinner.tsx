import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full">
      <div className="relative w-16 h-16">
        {/* Film reel circles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-amber-500 rounded-full"
            style={{
              top: `${Math.sin((i * Math.PI) / 4) * 24 + 50}%`,
              left: `${Math.cos((i * Math.PI) / 4) * 24 + 50}%`,
              animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
            }}
          />
        ))}
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-700 rounded-full" />
      </div>
      <p className="mt-4 text-amber-500 font-medium animate-pulse">Loading Movies...</p>
      
      {/* Add the keyframes for the pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(0.5);
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner; 