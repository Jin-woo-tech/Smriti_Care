import React from 'react';

interface BrainCrystalVisualProps {
  className?: string;
  size?: number;
}

export const BrainCrystalVisual: React.FC<BrainCrystalVisualProps> = ({
  className = '',
  size = 100,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Radial Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/30 via-cyan-400/30 to-sky-400/20 blur-xl animate-pulse-glow" />

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brainGlassGrad" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="brainGleam" x1="30" y1="15" x2="60" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <filter id="brainGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Brain Lobes Silhouette */}
        <path
          d="M60 20C45 20 32 28 28 42C24 46 22 53 23 60C20 66 22 74 26 80C30 87 38 92 48 94C53 98 60 98 60 98C60 98 67 98 72 94C82 92 90 87 94 80C98 74 100 66 97 60C98 53 96 46 92 42C88 28 75 20 60 20Z"
          fill="url(#brainGlassGrad)"
          filter="url(#brainGlow)"
        />

        {/* Specular Highlight Overlay */}
        <path
          d="M60 22C48 22 36 29 32 40C38 35 48 30 60 30C72 30 82 35 88 40C84 29 72 22 60 22Z"
          fill="url(#brainGleam)"
        />

        {/* Neural Gyri / Sulci Curves */}
        <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.75">
          {/* Left Hemisphere Sulci */}
          <path d="M42 35C38 42 42 48 36 54C32 58 35 66 40 70C44 73 40 82 46 86" />
          <path d="M50 30C46 38 52 44 48 52C44 60 52 68 48 76C46 80 50 86 54 90" />
          <path d="M30 48C36 50 38 56 34 62C30 68 36 74 34 78" />

          {/* Right Hemisphere Sulci */}
          <path d="M78 35C82 42 78 48 84 54C88 58 85 66 80 70C76 73 80 82 74 86" />
          <path d="M70 30C74 38 68 44 72 52C76 60 68 68 72 76C74 80 70 86 66 90" />
          <path d="M90 48C84 50 82 56 86 62C90 68 84 74 86 78" />

          {/* Central Longitudinal Fissure */}
          <path d="M60 24V94" stroke="#c5f82a" strokeWidth="2" strokeDasharray="3 3" />
        </g>

        {/* Glowing Neural Synaptic Nodes */}
        <circle cx="42" cy="42" r="2.5" fill="#c5f82a" className="animate-ping" style={{ transformOrigin: '42px 42px', animationDuration: '3s' }} />
        <circle cx="42" cy="42" r="2.5" fill="#c5f82a" />
        <circle cx="78" cy="44" r="2.5" fill="#67e8f9" className="animate-ping" style={{ transformOrigin: '78px 44px', animationDuration: '2.5s' }} />
        <circle cx="78" cy="44" r="2.5" fill="#67e8f9" />
        <circle cx="52" cy="65" r="2" fill="#ffffff" />
        <circle cx="68" cy="65" r="2" fill="#ffffff" />
        <circle cx="46" cy="80" r="2.5" fill="#c5f82a" />
        <circle cx="74" cy="80" r="2.5" fill="#67e8f9" />
      </svg>
    </div>
  );
};
