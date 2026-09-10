import React from 'react';

interface LiverCrystalVisualProps {
  className?: string;
  size?: number;
}

export const LiverCrystalVisual: React.FC<LiverCrystalVisualProps> = ({
  className = '',
  size = 100,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/35 via-teal-300/25 to-lime-300/20 blur-xl animate-pulse-glow" />

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="liverGlass" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="liverGleam" x1="30" y1="25" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Anatomical Liver Body */}
        <path
          d="M26 42C36 30 70 28 92 34C104 38 108 52 100 68C92 84 78 92 56 94C38 96 20 86 16 70C12 56 18 48 26 42Z"
          fill="url(#liverGlass)"
          stroke="#6ee7b7"
          strokeWidth="1.5"
          className="drop-shadow-lg"
        />

        {/* Specular Highlight */}
        <path
          d="M32 38C44 32 72 32 88 38C94 40 90 48 76 52C60 56 42 54 30 46C28 44 28 40 32 38Z"
          fill="url(#liverGleam)"
        />

        {/* Hepatic Portal Vein & Biliary Ducts */}
        <path d="M55 90C55 80 62 72 68 62" stroke="#a7f3d0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 62C72 56 80 54 84 50" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 62C62 58 54 56 46 54" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />

        {/* Gallbladder */}
        <path
          d="M48 78C46 84 48 90 52 92C56 94 60 90 60 84C60 78 54 74 50 76C48 76 48 78 48 78Z"
          fill="#c5f82a"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
