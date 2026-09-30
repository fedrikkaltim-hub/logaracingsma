import React from 'react';
import { ViewRole } from '../types/game';
import { soundManager } from '../utils/audio';

interface TopNavProps {
  currentView: ViewRole;
  onNavigate: (view: ViewRole) => void;
  onlineCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  onlineCount,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('role_select')}
          className="text-left group cursor-pointer"
        >
          <span className="text-xl font-black tracking-tight text-slate-950 font-racing flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-rose-600 inline-block transform -skew-x-12" />
            LOGARACING
            <span className="text-xs font-bold text-rose-600 tracking-wider">GP</span>
          </span>
        </button>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => onNavigate('concept_board')}
          className={`hover:text-rose-600 transition-colors py-1 cursor-pointer ${
            currentView === 'concept_board'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : ''
          }`}
        >
          Lembar Konsep UI (4 Alur)
        </button>
        <button
          onClick={() => onNavigate('role_select')}
          className={`hover:text-rose-600 transition-colors py-1 cursor-pointer ${
            currentView === 'role_select'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : ''
          }`}
        >
          Pilih Peran
        </button>
        <button
          onClick={() => onNavigate('teacher_room')}
          className={`hover:text-rose-600 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
            currentView === 'teacher_room'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : ''
          }`}
        >
          <span>Ruang Kendali Guru</span>
          {onlineCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">
              {onlineCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onNavigate('student_garage')}
          className={`hover:text-rose-600 transition-colors py-1 cursor-pointer ${
            currentView === 'student_garage'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : ''
          }`}
        >
          Garasi & Dashboard Siswa
        </button>
        <button
          onClick={() => onNavigate('student_cockpit')}
          className={`hover:text-rose-600 transition-colors py-1 cursor-pointer ${
            currentView === 'student_cockpit'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : ''
          }`}
        >
          Kokpit Balapan Siswa
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3">
        {/* Sound toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* Presentation Mode CTA */}
        <button
          onClick={() => onNavigate(currentView === 'concept_board' ? 'role_select' : 'concept_board')}
          className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer font-racing whitespace-nowrap"
        >
          <span>{currentView === 'concept_board' ? 'MODE INTERAKTIF' : 'LEMBAR KONSEP 4-IN-1'}</span>
        </button>
      </div>
    </header>
  );
};
