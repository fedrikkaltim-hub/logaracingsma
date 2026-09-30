import React from 'react';
import { FORMULA_CHEATSHEET } from '../data/questions';
import { MathView } from './MathView';

interface FormulaCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaCheatSheetModal: React.FC<FormulaCheatSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <h2 className="text-base font-bold text-slate-900 font-racing">
              PANDUAN PIT-WALL · SIFAT & RUMUS LENGKAP LOGARITMA SMA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Kuasai sifat-sifat persamaan dan operasi logaritma berikut untuk memacu kecepatan mobil balapmu di setiap tikungan sirkuit!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORMULA_CHEATSHEET.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-rose-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 font-racing">
                    {idx + 1}. {item.title}
                  </span>
                </div>

                {/* Rendered Math Equation */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-rose-700 my-2 text-center text-sm md:text-base font-semibold shadow-inner overflow-x-auto">
                  <MathView math={item.latex} displayMode={true} />
                </div>

                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all font-racing btn-press cursor-pointer shadow-md"
          >
            TUTUP & LANJUTKAN BALAPAN
          </button>
        </div>
      </div>
    </div>
  );
};
