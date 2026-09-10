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
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-200 border border-teal-200 dark:border-teal-700 transition-all cursor-pointer ${sizeClasses[size]} ${className}`}
      title="Click to hear this text read aloud"
    >
      {isSpeaking ? (
        <VolumeX size={iconSizes[size]} className="animate-pulse text-amber-600" />
      ) : (
        <Volume2 size={iconSizes[size]} className="text-teal-700 dark:text-teal-300" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};
