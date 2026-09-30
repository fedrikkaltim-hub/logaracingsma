import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';

interface F1ThemePlayerProps {
  autoPlay?: boolean;
}

export const F1ThemePlayer: React.FC<F1ThemePlayerProps> = ({ autoPlay = true }) => {
  const [isPlaying, setIsPlaying] = useState(soundManager.isThemePlaying);
  const [volume, setVolume] = useState(soundManager.themeVolume);

  useEffect(() => {
    if (autoPlay && !soundManager.isThemePlaying && !soundManager.isMuted) {
      soundManager.startF1Theme(volume);
      setIsPlaying(true);
    }
  }, [autoPlay, volume]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundManager.stopF1Theme();
      setIsPlaying(false);
    } else {
      soundManager.startF1Theme(volume);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundManager.setThemeVolume(newVol);
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-3 md:px-5 md:py-3 border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
      {/* Left: Track Info & Equalizer */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-md btn-press cursor-pointer shrink-0 ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/40 ring-2 ring-rose-400/50'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/40'
          }`}
          title={isPlaying ? 'Jeda Musik F1 Theme' : 'Putar Musik F1 Theme'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Track Title */}
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-black font-racing tracking-wide text-rose-400">
              BACKSOUND RESMI F1 GRAND PRIX
            </span>
          </div>
          <div className="text-xs font-bold text-slate-100 font-racing truncate max-w-[260px] md:max-w-md">
            Brian Tyler - Formula 1 Official Theme (Adrenaline Synth Orchestral)
          </div>
        </div>
      </div>

      {/* Center/Right: Audio Visualizer Equalizer & Volume Slider */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        {/* Animated Equalizer Bars */}
        <div className="flex items-end gap-1 h-5 px-2">
          {[40, 90, 60, 100, 75, 45, 85, 30].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-cyan-400' : 'bg-slate-600'
              }`}
              style={{
                height: isPlaying ? `${Math.max(20, (h + (i * 15)) % 100)}%` : '20%',
                animation: isPlaying ? `pulse 0.${(i % 4) + 4}s ease-in-out infinite alternate` : 'none',
              }}
            />
          ))}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 md:w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            title="Volume Musik F1"
          />
          <span className="text-[11px] font-mono text-slate-400 w-7 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
