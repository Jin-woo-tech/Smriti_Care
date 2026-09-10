import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VoiceNarratorButtonProps {
  textToRead: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const VoiceNarratorButton: React.FC<VoiceNarratorButtonProps> = ({
  textToRead,
  size = 'md',
  label,
  className = '',
}) => {
  const { narrate, isSpeaking, stopVoice } = useApp();

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3 text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopVoice();
    } else {
      narrate(textToRead);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Read text aloud"
      className={`inline-flex items-center gap-1.5 font-bold rounded-2xl bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border border-purple-400/30 transition-all cursor-pointer backdrop-blur-md shadow-xs ${sizeClasses[size]} ${className}`}
      title="Click to hear this text read aloud"
    >
      {isSpeaking ? (
        <VolumeX size={iconSizes[size]} className="animate-pulse text-amber-400" />
      ) : (
        <Volume2 size={iconSizes[size]} className="text-[#c084fc]" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};
