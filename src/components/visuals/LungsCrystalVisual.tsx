import React from 'react';

interface LungsCrystalVisualProps {
  className?: string;
  size?: number;
}

export const LungsCrystalVisual: React.FC<LungsCrystalVisualProps> = ({
  className = '',
  size = 110,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/35 via-blue-500/25 to-emerald-400/20 blur-xl animate-pulse-glow" />

      <svg
        viewBox="0 0 130 130"
        className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lungGlass" x1="20" y1="20" x2="110" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="90%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="tracheaGrad" x1="65" y1="10" x2="65" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Trachea Windpipe */}
        <path
          d="M60 12C60 10 70 10 70 12V48L84 62M70 48L46 62"
          stroke="url(#tracheaGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Lung Lobe */}
        <path
          d="M48 45C38 48 24 60 22 78C20 95 28 112 44 116C54 118 60 110 58 98C56 86 54 62 48 45Z"
          fill="url(#lungGlass)"
          stroke="#7dd3fc"
          strokeWidth="1.5"
          className="drop-shadow-lg"
        />

        {/* Right Lung Lobe */}
        <path
          d="M82 45C92 48 106 60 108 78C110 95 102 112 86 116C76 118 70 110 72 98C74 86 76 62 82 45Z"
          fill="url(#lungGlass)"
          stroke="#7dd3fc"
          strokeWidth="1.5"
          className="drop-shadow-lg"
        />

        {/* Bronchial Tree Network (Left) */}
        <g stroke="#34d399" strokeWidth="1.8" strokeLinecap="round">
          <path d="M50 62C42 70 32 76 28 86" />
          <path d="M42 70C38 78 36 88 38 98" />
          <path d="M46 78C42 86 46 96 48 104" />
          <path d="M34 76C28 82 26 90 28 96" />
        </g>

        {/* Bronchial Tree Network (Right) */}
        <g stroke="#34d399" strokeWidth="1.8" strokeLinecap="round">
          <path d="M80 62C88 70 98 76 102 86" />
          <path d="M88 70C92 78 94 88 92 98" />
          <path d="M84 78C88 86 84 96 82 104" />
          <path d="M96 76C102 82 104 90 102 96" />
        </g>

        {/* Glowing Alveoli Nodes */}
        <circle cx="28" cy="86" r="2.5" fill="#c5f82a" />
        <circle cx="38" cy="98" r="2.5" fill="#67e8f9" />
        <circle cx="48" cy="104" r="2.5" fill="#34d399" />
        <circle cx="102" cy="86" r="2.5" fill="#c5f82a" />
        <circle cx="92" cy="98" r="2.5" fill="#67e8f9" />
        <circle cx="82" cy="104" r="2.5" fill="#34d399" />
      </svg>
    </div>
  );
};
