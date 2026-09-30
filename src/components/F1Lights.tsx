import React from 'react';

interface F1LightsProps {
  lightsOnCount: number; // 0 to 5
  isLightsOut?: boolean; // When race officially starts (all go green / off)
  size?: 'sm' | 'md' | 'lg';
}

export const F1Lights: React.FC<F1LightsProps> = ({
  lightsOnCount,
  isLightsOut = false,
  size = 'md',
}) => {
  const gantryPillSizes = {
    sm: 'p-1.5 gap-2',
    md: 'p-2.5 gap-3.5',
    lg: 'p-4 gap-5',
  };

  const lightSizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center">
      {/* Overhead Gantry structure */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl flex items-center px-4 py-2 relative">
        <div className={`flex items-center ${gantryPillSizes[size]}`}>
          {[1, 2, 3, 4, 5].map((lightIdx) => {
            const isLit = !isLightsOut && lightsOnCount >= lightIdx;
            const isGreenGo = isLightsOut && lightsOnCount === 0;

            return (
              <div
                key={lightIdx}
                className="flex flex-col items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800"
              >
                {/* Light circle */}
                <div
                  className={`${lightSizes[size]} rounded-full transition-all duration-150 flex items-center justify-center relative ${
                    isLit
                      ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.95)] ring-2 ring-red-400'
                      : isGreenGo
                      ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.95)] ring-2 ring-emerald-300'
                      : 'bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  {isLit && (
                    <div className="w-2 h-2 rounded-full bg-white opacity-80 animate-ping" />
                  )}
                  {isGreenGo && (
                    <div className="w-2 h-2 rounded-full bg-white opacity-80 animate-ping" />
                  )}
                </div>
                {/* Light pole base indicator */}
                <div className="w-1.5 h-1 bg-slate-700 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
      {/* Gantry pole stands */}
      <div className="flex justify-between w-full max-w-[90%] px-4">
        <div className="w-1.5 h-3 bg-slate-700" />
        <div className="w-1.5 h-3 bg-slate-700" />
      </div>
    </div>
  );
};
