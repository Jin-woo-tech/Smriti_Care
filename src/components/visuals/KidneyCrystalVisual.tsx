import React from 'react';

interface KidneyCrystalVisualProps {
  className?: string;
  size?: number;
}

export const KidneyCrystalVisual: React.FC<KidneyCrystalVisualProps> = ({
  className = '',
  size = 100,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/35 via-blue-600/25 to-sky-300/20 blur-xl animate-pulse-glow" />

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="kidneyGlass" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="kidneyGleam" x1="30" y1="20" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Bean-shaped Kidney Contour */}
        <path
          d="M58 20C40 20 28 32 26 50C24 68 34 86 52 96C68 104 84 96 90 82C96 68 90 54 80 50C70 46 68 38 72 30C74 24 68 20 58 20Z"
          fill="url(#kidneyGlass)"
          stroke="#7dd3fc"
          strokeWidth="1.5"
          className="drop-shadow-lg"
        />

        {/* Specular Gleam */}
        <path
          d="M48 24C36 26 30 36 30 48C36 38 46 32 58 30C58 26 54 24 48 24Z"
          fill="url(#kidneyGleam)"
        />

        {/* Renal Hilum & Vessels */}
        <path d="M72 48C84 46 96 42 104 38" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M70 54C82 56 94 56 102 54" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 62C72 72 78 86 84 100" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />

        {/* Glomerular Filtration Glowing Nodes */}
        <circle cx="45" cy="45" r="2" fill="#c5f82a" className="animate-ping" style={{ transformOrigin: '45px 45px', animationDuration: '3s' }} />
        <circle cx="45" cy="45" r="2" fill="#c5f82a" />
        <circle cx="42" cy="62" r="2" fill="#67e8f9" />
        <circle cx="54" cy="74" r="2" fill="#38bdf8" />
      </svg>
    </div>
  );
};
