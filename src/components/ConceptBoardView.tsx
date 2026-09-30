import React from 'react';
import { ViewRole, Student } from '../types/game';
import { F1Lights } from './F1Lights';
import { F1CircuitTrack } from './F1CircuitTrack';
import { MathView } from './MathView';

interface ConceptBoardViewProps {
  onNavigate: (view: ViewRole) => void;
  students: Student[];
}

export const ConceptBoardView: React.FC<ConceptBoardViewProps> = ({
  onNavigate,
  students,
}) => {
  const previewStudents: Student[] = students.length > 0 ? students : [
    { id: '1', name: 'Max V.', carColor: '#1E3A8A', secondaryColor: '#EF4444', carNumber: 1, teamName: 'Bull Velocity', isReady: true, progress: 90, currentLap: 1, isFinished: false, score: 950, correctCount: 9, wrongCount: 0, streak: 9, speedKmh: 340, gear: 8, rpm: 12500, lastAnswerStatus: 'correct' },
    { id: '2', name: 'Charles L.', carColor: '#E10600', secondaryColor: '#FFE600', carNumber: 16, teamName: 'Maranello Racing', isReady: true, progress: 80, currentLap: 1, isFinished: false, score: 820, correctCount: 8, wrongCount: 1, streak: 3, speedKmh: 325, gear: 8, rpm: 11900, lastAnswerStatus: 'correct' },
    { id: '3', name: 'Lando N.', carColor: '#FF8000', secondaryColor: '#00D2BE', carNumber: 4, teamName: 'McLaren Apex', isReady: true, progress: 70, currentLap: 1, isFinished: false, score: 700, correctCount: 7, wrongCount: 2, streak: 1, speedKmh: 310, gear: 7, rpm: 11400, lastAnswerStatus: 'idle' },
    { id: '4', name: 'Lewis H.', carColor: '#00A19B', secondaryColor: '#00D2BE', carNumber: 44, teamName: 'Silver Arrow', isReady: true, progress: 60, currentLap: 1, isFinished: false, score: 610, correctCount: 6, wrongCount: 1, streak: 0, speedKmh: 295, gear: 7, rpm: 11000, lastAnswerStatus: 'idle' },
    { id: '5', name: 'Fernando A.', carColor: '#047857', secondaryColor: '#A3E635', carNumber: 14, teamName: 'British Speed', isReady: true, progress: 50, currentLap: 1, isFinished: false, score: 500, correctCount: 5, wrongCount: 0, streak: 5, speedKmh: 285, gear: 6, rpm: 10500, lastAnswerStatus: 'idle' },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-100 p-4 md:p-8 racing-grid flex flex-col items-center">
      {/* 16:9 Concept Board Header */}
      <div className="w-full max-w-7xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-rose-600 font-racing tracking-widest">
              LEMBAR KONSEP DESAIN · 1 LAP SPRINT · 10 SOAL EQUATION WEB · TOP 10 FINISH PODIUM
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-950 font-racing tracking-tight">
            LOGARACING: TANTANGAN LOGARITMA
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-3xl">
            Sistem balapan 1 lap penuh dengan 10 soal logaritma SMA dalam format Equation KaTeX web. Dilengkapi autentikasi guru, backsound F1 Theme, dan animasi klik tombol.
          </p>
        </div>

        {/* Spec Tags */}
        <div className="flex flex-wrap gap-2 text-xs font-racing font-bold">
          <span className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-800">
            📐 FORMAT EQUATION KATEX
          </span>
          <span className="px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-700">
            📝 10 SOAL SPRINT
          </span>
          <span className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
            🏆 TOP 10 FINISH PODIUM
          </span>
        </div>
      </div>

      {/* The 4 Main Flows Displayed in a 4-Quadrant Concept Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ================= FLOW 1 ================= */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg flex flex-col justify-between hover:border-rose-500 transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-black font-racing">
                  ALUR 1
                </span>
                <h3 className="text-base font-bold text-slate-900 font-racing">
                  DASHBOARD PEMILIHAN PERAN
                </h3>
              </div>
              <button
                onClick={() => onNavigate('role_select')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 font-racing underline btn-press cursor-pointer"
              >
                Buka Layar Penuh →
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Layar utama dengan gantry lampu start F1 5-sinyal, kode ruang kelas, dan dua tombol navigasi bercahaya untuk Guru dan Siswa.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-center">
              <div className="flex justify-center scale-75 origin-center -my-2">
                <F1Lights lightsOnCount={5} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border-2 border-emerald-500 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-emerald-700 font-racing block">ROLE GURU (AUTH)</span>
                  <div className="mt-1 py-1.5 px-2 bg-emerald-600 text-white rounded-lg text-xs font-black font-racing shadow btn-press">
                    MASUK SEBAGAI GURU
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border-2 border-rose-500 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-rose-700 font-racing block">ROLE SISWA</span>
                  <div className="mt-1 py-1.5 px-2 bg-rose-600 text-white rounded-lg text-xs font-black font-racing shadow btn-press">
                    MASUK SEBAGAI SISWA
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>• Animasi Tombol Click Tactile</span>
            <span>• 5-Light Audio Beep</span>
          </div>
        </div>

        {/* ================= FLOW 2 ================= */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg flex flex-col justify-between hover:border-amber-500 transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-black font-racing">
                  ALUR 2
                </span>
                <h3 className="text-base font-bold text-slate-900 font-racing">
                  LOGIN SISWA, GARASI & STATUS SIAP
                </h3>
              </div>
              <button
                onClick={() => onNavigate('student_garage')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 font-racing underline btn-press cursor-pointer"
              >
                Buka Layar Penuh →
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Garasi tim F1 dengan input 'MASUKKAN NAMAMU', palet warna mobil, pratinjau lingkaran nomor balap, dan tombol status 'READY'.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-racing font-bold text-xs">
                  #33
                </div>
                <div className="text-xs font-bold text-slate-900 font-racing">
                  Nama: Max Verstappen (Maranello Red)
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-black font-racing text-xs text-center shadow-md flex items-center justify-center gap-2 btn-press">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>STATUS: READY (SIAP BALAPAN)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>• 10 Preset Warna Tim F1</span>
            <span>• Dashboard Statistik Siswa</span>
          </div>
        </div>

        {/* ================= FLOW 3 ================= */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg flex flex-col justify-between hover:border-emerald-500 transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black font-racing">
                  ALUR 3
                </span>
                <h3 className="text-base font-bold text-slate-900 font-racing">
                  LAYAR KONTROL GURU (BACKSOUND F1 THEME)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('teacher_room')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 font-racing underline btn-press cursor-pointer"
              >
                Buka Layar Penuh →
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Sirkuit GP berbelok 1 lap, counter 10 Finisher, tombol 'MULAI BALAPAN', backsound F1 Theme dan daftar hanya siswa yang online.
            </p>

            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200 h-44 overflow-hidden relative">
              <F1CircuitTrack students={previewStudents} currentLap={1} totalLaps={1} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>• Backsound F1 Theme Player</span>
            <span>• Auto Stop saat 10 Finisher</span>
          </div>
        </div>

        {/* ================= FLOW 4 ================= */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg flex flex-col justify-between hover:border-cyan-500 transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-cyan-600 text-white rounded-lg text-xs font-black font-racing">
                  ALUR 4
                </span>
                <h3 className="text-base font-bold text-slate-900 font-racing">
                  TAMPILAN KOKPIT (FORMAT EQUATION WEB)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('student_cockpit')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 font-racing underline btn-press cursor-pointer"
              >
                Buka Layar Penuh →
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Sudut pandang first-person dengan HUD transparan 10 persamaan logaritma KaTeX dan tombol kemudi (A, B, C, D) beranimasi pantul.
            </p>

            {/* Target element box */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white space-y-3">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 text-center">
                <span className="text-[10px] text-slate-300 font-racing block mb-1">EQUATION FORMAT WEB</span>
                <div className="text-lg font-black font-racing text-amber-300 flex items-center justify-center min-h-[32px]">
                  <MathView math="{}^2\log(8) + {}^2\log(4) = \dots" displayMode={true} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'A', val: '4' },
                  { label: 'B', val: '5' },
                  { label: 'C', val: '6' },
                  { label: 'D', val: '12' },
                ].map((opt, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-700 text-xs font-black font-racing text-white btn-press flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">{opt.label}</span>
                    <span className="text-sm font-bold text-amber-200">
                      <MathView math={opt.val} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>• KaTeX Typography Equations</span>
            <span>• 10 Soal Berurutan (Tanpa Looping)</span>
          </div>
        </div>

      </div>

      <div className="w-full max-w-7xl mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('role_select')}
          className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black font-racing text-sm shadow-xl shadow-rose-600/30 transition-all btn-press cursor-pointer"
        >
          MULAI JALANKAN GAME SECARA INTERAKTIF →
        </button>
      </div>
    </div>
  );
};
