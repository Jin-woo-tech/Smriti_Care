import React from 'react';

export const HologramGlobeVisual: React.FC = () => {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-md animate-pulse" />

      {/* SVG 3D Holographic Wireframe Globe with Orbit Rings matching Image #10 */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-spin [animation-duration:18s] drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="globeGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Base Sphere */}
        <circle cx="50" cy="50" r="36" fill="url(#globeGrad)" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />

        {/* Latitude Lines */}
        <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
        <ellipse cx="50" cy="50" rx="36" ry="26" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
        <line x1="14" y1="50" x2="86" y2="50" stroke="#7dd3fc" strokeWidth="1.2" strokeOpacity="0.8" />

        {/* Longitude / Meridians */}
        <ellipse cx="50" cy="50" rx="14" ry="36" fill="none" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
        <ellipse cx="50" cy="50" rx="26" ry="36" fill="none" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
        <line x1="50" y1="14" x2="50" y2="86" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.8" />

        {/* Glowing Data Nodes */}
        <circle cx="42" cy="38" r="2.5" fill="#c5f82a" />
        <circle cx="60" cy="46" r="2" fill="#38bdf8" />
        <circle cx="34" cy="58" r="2" fill="#c5f82a" />
        <circle cx="58" cy="65" r="2.5" fill="#38bdf8" />

        {/* Orbital Ring Angle */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="10"
          transform="rotate(-25 50 50)"
          fill="none"
          stroke="#c5f82a"
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />
      </svg>
    </div>
  );
};
