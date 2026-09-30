import React, { useState } from 'react';
import { ViewRole } from '../types/game';
import { F1Lights } from './F1Lights';
import { soundManager } from '../utils/audio';

interface RoleSelectionViewProps {
  onSelectRole: (role: ViewRole) => void;
  onRequestTeacherAccess: () => void;
  onlineCount: number;
  roomCode: string;
}

export const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({
  onSelectRole,
  onRequestTeacherAccess,
  onlineCount,
  roomCode,
}) => {
  const [demoLights, setDemoLights] = useState(5);

  const handleTestLights = () => {
    soundManager.playRedLightBeep();
    setDemoLights((prev) => (prev % 5) + 1);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-between p-6 md:p-10 racing-grid overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Banner & Starting Lights Section */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center z-10 pt-4">
        {/* F1 5-Light Start Gantry */}
        <div className="cursor-pointer mb-6 transform hover:scale-105 transition-transform" onClick={handleTestLights}>
          <F1Lights lightsOnCount={demoLights} size="md" />
          <span className="text-[10px] text-slate-500 tracking-wider font-mono mt-1 block">
            KLIK LAMPU UNTUK TES SINYAL START
          </span>
        </div>

        {/* Main Title Lockup */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 font-racing tracking-wider">
            MATEMATIKA SMA KELAS X - XII · KURIKULUM MERDEKA
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-950 font-racing leading-tight text-balance">
          LOGARACING
          <span className="text-rose-600 block text-2xl md:text-3xl font-bold tracking-widest mt-1">
            TANTANGAN LOGARITMA
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl mt-3 font-normal leading-relaxed">
          Uji kecepatan dan ketepatan sifat logaritma di sirkuit Grand Prix F1. Format 1 Lap Sprint dengan 10 soal logaritma dan podium juara 10 besar!
        </p>

        {/* Live Room Badge */}
        <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-slate-600">
          <span>KODE ROOM: <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{roomCode}</strong></span>
          <span aria-hidden="true">·</span>
          <span>STATUS: <span className="text-emerald-700 font-bold">{onlineCount} Siswa Terhubung</span></span>
        </div>
      </div>

      {/* Alur 1: Two Glowing Role Selection Navigation Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 my-8 z-10">
        {/* Card 1: Masuk Sebagai Guru (Protected with Login) */}
        <div className="group relative bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-racing">
                KHUSUS GURU · TERKUNCI
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 font-racing">
              Masuk Sebagai Guru
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Ruang kendali sirkuit GP, kendali lampu start, dan backsound resmi F1 Theme. Memerlukan autentikasi akun guru pengajar.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Terproteksi sandi guru (Siswa tidak bisa masuk)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Backsound musik F1 Theme & visualizer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Leaderboard real-time 10 finisher juara</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              soundManager.playCorrectSound();
              onRequestTeacherAccess();
            }}
            className="mt-6 w-full py-3.5 px-6 rounded-xl font-racing font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2 group-hover:translate-y-[-2px] cursor-pointer btn-press btn-shockwave"
          >
            <span>MASUK SEBAGAI GURU (LOGIN)</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Card 2: Masuk Sebagai Siswa */}
        <div className="group relative bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-rose-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full font-racing">
                F1 DRIVER PADDOCK
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 font-racing">
              Masuk Sebagai Siswa
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Masuki garasi balap F1, pilih nama & warna tim andalanmu, nyalakan status SIAP, dan bersiaplah memacu mobil di kokpit saat start dimulai!
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Kustomisasi warna mobil & nomor balap</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Tombol status 'READY' bercahaya dinamis</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Kokpit HUD interaktif 10 soal + remedial loop</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              soundManager.playCorrectSound();
              onSelectRole('student_garage');
            }}
            className="mt-6 w-full py-3.5 px-6 rounded-xl font-racing font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 group-hover:translate-y-[-2px] cursor-pointer btn-press btn-shockwave"
          >
            <span>MASUK SEBAGAI SISWA</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="text-xs text-slate-500 text-center z-10 pb-2">
        <span>LogaRacing Grand Prix Edition · Desain Light Mode dengan Aksen Telemetri F1</span>
      </div>
    </div>
  );
};
