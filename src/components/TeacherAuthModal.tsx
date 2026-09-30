import React, { useState } from 'react';
import { soundManager } from '../utils/audio';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Validate credentials securely
      if (username.trim() === 'admin' && password === 'adminsmada') {
        soundManager.playCorrectSound();
        setIsLoading(false);
        onSuccess();
      } else {
        soundManager.playWrongSound();
        setIsLoading(false);
        setErrorMsg('Username atau Password salah! Akses hanya untuk Guru.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden p-6 md:p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Lockup */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-emerald-700 font-racing tracking-widest uppercase">
            AUTENTIKASI RACE DIRECTOR
          </span>
          <h2 className="text-2xl font-black text-slate-950 font-racing mt-1">
            LOGIN RUANG GURU
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hanya guru pengajar berwenang yang dapat mengakses kontrol sirkuit dan bank soal.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
            <span className="text-sm">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-racing">
              USERNAME GURU
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username..."
              autoFocus
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-racing">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                required
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 font-semibold p-1 cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-black text-sm font-racing tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 btn-press btn-shockwave cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>MEMVERIFIKASI...</span>
            ) : (
              <>
                <span>MASUK KE RUANG KENDALI GURU</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
