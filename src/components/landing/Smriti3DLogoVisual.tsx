import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Smriti3DLogoVisualProps {
  onExplore: () => void;
  exploreLabel?: string;
}

export const Smriti3DLogoVisual: React.FC<Smriti3DLogoVisualProps> = ({
  onExplore,
  exploreLabel = 'Explore Services',
}) => {
  return (
    <div className="relative w-full max-w-[560px] mx-auto flex flex-col items-center justify-center select-none py-4">
      {/* Background Soft Glow Aura in Purple & Electric Cyan */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-indigo-600/20 to-transparent blur-3xl rounded-full scale-125 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />

      {/* 3D Visual Stage with Perspective Container */}
      <div className="relative w-full aspect-square max-w-[460px] flex items-center justify-center">
        {/* Outer Rotating Holographic Orbit Ring 1 */}
        <div className="absolute inset-4 rounded-full border border-purple-500/30 animate-[spin_20s_linear_infinite] pointer-events-none border-dashed" />

        {/* Outer Counter-Rotating Holographic Orbit Ring 2 */}
        <div className="absolute inset-10 rounded-full border border-cyan-400/20 animate-[spin_28s_linear_infinite_reverse] pointer-events-none" />

        {/* Orbiting Neon Energy Beads */}
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite] pointer-events-none">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_16px_#38bdf8] animate-pulse" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-purple-400 shadow-[0_0_16px_#c084fc] animate-pulse" />
        </div>

        <div className="absolute inset-0 animate-[spin_18s_linear_infinite_reverse] pointer-events-none">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_14px_#818cf8]" />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_14px_#f472b6]" />
        </div>

        {/* 3D Glass Platform Base Reflection */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-t from-purple-500/25 to-transparent rounded-[100%] blur-xl pointer-events-none" />

        {/* Floating 3D Logo Image Wrapper */}
        <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center animate-float-slow group cursor-pointer transition-transform duration-500 hover:scale-105">
          {/* Specular Ambient Ring behind the logo */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-600/25 via-white/5 to-cyan-500/20 blur-xl group-hover:scale-110 transition-transform duration-700" />

          <img
            src="/smriti-logo.png"
            alt="SmritiCare Logo 3D Visual"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(168,85,247,0.5)] drop-shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all duration-500 group-hover:drop-shadow-[0_25px_50px_rgba(168,85,247,0.7)]"
            onError={(e) => {
              // Fallback to 26027-removebg-preview.png if needed
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('26027-removebg-preview.png')) {
                target.src = '/26027-removebg-preview.png';
              }
            }}
          />

          {/* Holographic Sparkle Badges */}
          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-200 text-[10px] font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5 animate-bounce">
            <Sparkles size={12} className="text-[#c084fc]" />
            <span>AI Care</span>
          </div>

          <div className="absolute bottom-16 left-2 z-20 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-200 text-[10px] font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-cyan-300" />
            <span>SIH 2026</span>
          </div>
        </div>

        {/* Center Interactive CTA Button Overlaid on 3D Base */}
        <div className="absolute -bottom-2 sm:bottom-2 z-20">
          <button
            onClick={onExplore}
            className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#a855f7] via-[#9333ea] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-black text-sm sm:text-base tracking-wide shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/80 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-300/60 backdrop-blur-md"
          >
            <span>{exploreLabel}</span>
            <ArrowRight size={18} className="text-white group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
