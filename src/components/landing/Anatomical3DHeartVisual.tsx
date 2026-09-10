import React from 'react';
import { Activity, Sparkles, ArrowRight } from 'lucide-react';

interface Anatomical3DHeartVisualProps {
  onExplore: () => void;
  exploreLabel?: string;
}

export const Anatomical3DHeartVisual: React.FC<Anatomical3DHeartVisualProps> = ({
  onExplore,
  exploreLabel = 'Explore Services',
}) => {
  return (
    <div className="relative w-full max-w-[540px] mx-auto flex flex-col items-center justify-center select-none py-2">
      {/* Background Soft Glow Aura matching Image #10 */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-400/20 via-blue-500/10 to-transparent blur-3xl rounded-full scale-110 pointer-events-none" />

      {/* 3D Glossy Anatomical Heart Graphic */}
      <div className="relative w-full aspect-square max-w-[440px] flex items-center justify-center animate-float-slow">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] filter"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ceramic Pearl White / Metallic Shading Gradients matching Image #10 */}
            <radialGradient id="specularGlow" cx="40%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#e2e8f0" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
            </radialGradient>

            <linearGradient id="arteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="80%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="bodyGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#e2e8f0" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="85%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="leftVentricleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="veinGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <filter id="glossHighlight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Top Great Vessels & Aortic Arches matching Image #10 glossy ceramic pipes */}
          {/* Vena Cava / Right Pulmonary Tube */}
          <path
            d="M 180 160 C 170 120, 160 80, 185 60 C 198 50, 215 55, 218 80 C 220 105, 215 130, 210 160 Z"
            fill="url(#arteryGrad)"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Main Aorta Arch */}
          <path
            d="M 225 150 C 220 90, 240 50, 275 52 C 310 54, 320 95, 315 150 C 300 165, 260 165, 225 150 Z"
            fill="url(#arteryGrad)"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Left Subclavian & Carotid Branch Tubes */}
          <path
            d="M 270 70 C 265 40, 280 20, 295 25 C 305 28, 305 50, 300 75 Z"
            fill="url(#arteryGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <path
            d="M 305 85 C 315 50, 335 35, 350 45 C 360 52, 350 75, 335 95 Z"
            fill="url(#arteryGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <path
            d="M 330 110 C 350 85, 380 75, 395 90 C 405 102, 390 125, 365 140 Z"
            fill="url(#arteryGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Main Cardiac Muscular Bulk / Ventricles in 3D Ceramic White */}
          <path
            d="M 200 160
               C 140 180, 130 250, 155 310
               C 180 370, 230 430, 260 450
               C 275 440, 340 370, 365 300
               C 390 230, 360 170, 300 160
               C 260 155, 230 155, 200 160 Z"
            fill="url(#bodyGrad)"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* Anterior Interventricular Sulcus / Contour Division */}
          <path
            d="M 255 170
               C 245 230, 220 300, 255 445"
            fill="none"
            stroke="#334155"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* High-Gloss Specular Highlights (Ceramic reflections matching Image #10) */}
          <path
            d="M 180 200 C 160 230, 160 280, 175 320 C 170 280, 175 230, 195 200 Z"
            fill="url(#specularGlow)"
            opacity="0.85"
          />
          <path
            d="M 260 190 C 270 230, 260 270, 245 310 C 255 270, 260 230, 255 190 Z"
            fill="#ffffff"
            opacity="0.6"
            filter="url(#glossHighlight)"
          />
          <ellipse
            cx="320"
            cy="240"
            rx="25"
            ry="45"
            transform="rotate(20 320 240)"
            fill="url(#specularGlow)"
            opacity="0.75"
          />

          {/* Intricate Coronary Arteries / Neural Pathways Web matching Image #10 */}
          {/* Main Left Anterior Descending Artery */}
          <path
            d="M 250 175 Q 235 220, 225 260 T 215 310 T 235 370 T 255 435"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Branching Arterial Network */}
          <path
            d="M 228 250 Q 195 265, 175 295 M 220 290 Q 190 320, 185 350 M 230 340 Q 205 370, 220 400"
            fill="none"
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 235 240 Q 275 260, 310 285 M 225 285 Q 270 315, 305 345 M 235 330 Q 280 360, 290 395"
            fill="none"
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 310 285 Q 345 300, 355 330 M 305 345 Q 330 365, 335 390"
            fill="none"
            stroke="#475569"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Subtle Glowing Cyan Pulse Points on arteries */}
          <circle cx="235" cy="240" r="3" fill="#38bdf8" className="animate-ping opacity-75" />
          <circle cx="310" cy="285" r="3.5" fill="#38bdf8" />
          <circle cx="215" cy="310" r="3" fill="#38bdf8" />
          <circle cx="255" cy="435" r="4" fill="#38bdf8" className="animate-pulse" />
        </svg>

        {/* Center CTA Button Overlaid on Heart (Matching Image #10) */}
        <div className="absolute bottom-6 sm:bottom-8 z-20">
          <button
            onClick={onExplore}
            className="group inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#c5f82a] hover:bg-[#d4ff42] text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-2xl shadow-[#c5f82a]/30 hover:shadow-[#c5f82a]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#c5f82a]/80"
          >
            <span>{exploreLabel}</span>
            <ArrowRight size={18} className="text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
