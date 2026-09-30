import { Question } from '../types/game';

export interface EquationItem {
  id: string;
  latex: string;
  prefixText?: string;
  suffixText?: string;
  explanationLatex: string;
  optionsLatex: string[];
  correctIndex: number;
  category: 'Sifat Dasar' | 'Penjumlahan & Selisih' | 'Perkalian & Basis' | 'Pangkat Numerus' | 'Persamaan Logaritma';
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
}

export const LOGARITHM_QUESTIONS: (Question & { equationLatex: string; optionsLatex: string[]; explanationLatex: string })[] = [
  {
    id: 'q1',
    expression: '{}^2\\log(8) + {}^2\\log(4)',
    equationLatex: '{}^2\\log(8) + {}^2\\log(4) = \\dots',
    plainText: '^2log(8) + ^2log(4) = ...',
    explanation: 'Sifat penjumlahan: {}^a\\log(b) + {}^a\\log(c) = {}^a\\log(b \\times c). Maka {}^2\\log(8 \\times 4) = {}^2\\log(32) = 5.',
    explanationLatex: '{}^a\\log(b) + {}^a\\log(c) = {}^a\\log(b \\times c) \\implies {}^2\\log(32) = 5',
    options: ['4', '5', '6', '12'],
    optionsLatex: ['4', '5', '6', '12'],
    correctIndex: 1, // 5
    category: 'Penjumlahan & Selisih',
    difficulty: 'Mudah',
  },
  {
    id: 'q2',
    expression: '{}^3\\log(81) - {}^3\\log(9)',
    equationLatex: '{}^3\\log(81) - {}^3\\log(9) = \\dots',
    plainText: '^3log(81) - ^3log(9) = ...',
    explanation: 'Sifat pengurangan: {}^a\\log(b) - {}^a\\log(c) = {}^a\\log(b / c). Maka {}^3\\log(81 / 9) = {}^3\\log(9) = 2.',
    explanationLatex: '{}^a\\log(b) - {}^a\\log(c) = {}^a\\log\\left(\\frac{b}{c}\\right) \\implies {}^3\\log(9) = 2',
    options: ['1', '2', '3', '9'],
    optionsLatex: ['1', '2', '3', '9'],
    correctIndex: 1, // 2
    category: 'Penjumlahan & Selisih',
    difficulty: 'Mudah',
  },
  {
    id: 'q3',
    expression: '{}^2\\log(3) \\times {}^3\\log(16)',
    equationLatex: '{}^2\\log(3) \\times {}^3\\log(16) = \\dots',
    plainText: '^2log(3) × ^3log(16) = ...',
    explanation: 'Sifat rantai: {}^a\\log(b) \\times {}^b\\log(c) = {}^a\\log(c). Maka {}^2\\log(16) = 4.',
    explanationLatex: '{}^a\\log(b) \\times {}^b\\log(c) = {}^a\\log(c) \\implies {}^2\\log(16) = 4',
    options: ['2', '3', '4', '8'],
    optionsLatex: ['2', '3', '4', '8'],
    correctIndex: 2, // 4
    category: 'Perkalian & Basis',
    difficulty: 'Sedang',
  },
  {
    id: 'q4',
    expression: '{}^5\\log(125)',
    equationLatex: '{}^5\\log(125) = \\dots',
    plainText: '^5log(125) = ...',
    explanation: 'Karena 125 = 5^3, maka {}^5\\log(5^3) = 3.',
    explanationLatex: '125 = 5^3 \\implies {}^5\\log(5^3) = 3',
    options: ['2', '3', '5', '25'],
    optionsLatex: ['2', '3', '5', '25'],
    correctIndex: 1, // 3
    category: 'Sifat Dasar',
    difficulty: 'Mudah',
  },
  {
    id: 'q5',
    expression: '{}^8\\log(32)',
    equationLatex: '{}^8\\log(32) = \\dots',
    plainText: '^8log(32) = ...',
    explanation: 'Ubah ke basis 2: 8 = 2^3 dan 32 = 2^5. Sifat: \\frac{5}{3} \\cdot {}^2\\log(2) = \\frac{5}{3}.',
    explanationLatex: '{}^{2^3}\\log(2^5) = \\frac{5}{3} \\cdot {}^2\\log(2) = \\frac{5}{3}',
    options: ['4/3', '5/3', '3/5', '2'],
    optionsLatex: ['\\frac{4}{3}', '\\frac{5}{3}', '\\frac{3}{5}', '2'],
    correctIndex: 1, // 5/3
    category: 'Pangkat Numerus',
    difficulty: 'Sedang',
  },
  {
    id: 'q6',
    expression: '{}^2\\log(x - 3) = 3',
    equationLatex: '{}^2\\log(x - 3) = 3 \\implies x = \\dots',
    plainText: 'Jika ^2log(x - 3) = 3, maka nilai x = ...',
    explanation: 'Bentuk eksponen: x - 3 = 2^3 = 8 \\implies x = 8 + 3 = 11.',
    explanationLatex: 'x - 3 = 2^3 = 8 \\implies x = 11',
    options: ['9', '10', '11', '12'],
    optionsLatex: ['9', '10', '11', '12'],
    correctIndex: 2, // 11
    category: 'Persamaan Logaritma',
    difficulty: 'Sedang',
  },
  {
    id: 'q7',
    expression: '{}^{\\sqrt{2}}\\log(16)',
    equationLatex: '{}^{\\sqrt{2}}\\log(16) = \\dots',
    plainText: '^√2log(16) = ...',
    explanation: '\\sqrt{2} = 2^{1/2} dan 16 = 2^4. Maka \\frac{4}{1/2} = 8.',
    explanationLatex: '{}^{2^{1/2}}\\log(2^4) = \\frac{4}{1/2} \\cdot {}^2\\log(2) = 8',
    options: ['4', '6', '8', '16'],
    optionsLatex: ['4', '6', '8', '16'],
    correctIndex: 2, // 8
    category: 'Pangkat Numerus',
    difficulty: 'Sedang',
  },
  {
    id: 'q8',
    expression: '{}^6\\log(4) + {}^6\\log(9)',
    equationLatex: '{}^6\\log(4) + {}^6\\log(9) = \\dots',
    plainText: '^6log(4) + ^6log(9) = ...',
    explanation: '{}^6\\log(4 \\times 9) = {}^6\\log(36) = 2.',
    explanationLatex: '{}^6\\log(4 \\times 9) = {}^6\\log(36) = {}^6\\log(6^2) = 2',
    options: ['1', '2', '3', '6'],
    optionsLatex: ['1', '2', '3', '6'],
    correctIndex: 1, // 2
    category: 'Penjumlahan & Selisih',
    difficulty: 'Mudah',
  },
  {
    id: 'q9',
    expression: '{}^7\\log(1)',
    equationLatex: '{}^7\\log(1) = \\dots',
    plainText: '^7log(1) = ...',
    explanation: 'Sifat dasar logaritma: {}^a\\log(1) = 0 untuk semua a > 0, a \\neq 1.',
    explanationLatex: '{}^a\\log(1) = 0 \\implies {}^7\\log(1) = 0',
    options: ['0', '1', '7', '∞'],
    optionsLatex: ['0', '1', '7', '\\infty'],
    correctIndex: 0, // 0
    category: 'Sifat Dasar',
    difficulty: 'Mudah',
  },
  {
    id: 'q10',
    expression: '{}^2\\log(x^2 - 1) = {}^2\\log(8)',
    equationLatex: '{}^2\\log(x^2 - 1) = {}^2\\log(8) \\quad (x > 0)',
    plainText: 'Himpunan penyelesaian ^2log(x² - 1) = ^2log(8) untuk x > 0:',
    explanation: 'x^2 - 1 = 8 \\implies x^2 = 9 \\implies x = 3 (karena x > 0).',
    explanationLatex: 'x^2 - 1 = 8 \\implies x^2 = 9 \\implies x = 3',
    options: ['x = 2', 'x = 3', 'x = 4', 'x = 9'],
    optionsLatex: ['x = 2', 'x = 3', 'x = 4', 'x = 9'],
    correctIndex: 1, // x = 3
    category: 'Persamaan Logaritma',
    difficulty: 'Tantangan',
  },
  {
    id: 'q11',
    expression: '{}^{25}\\log(5)',
    equationLatex: '{}^{25}\\log(5) = \\dots',
    plainText: '^25log(5) = ...',
    explanation: '25 = 5^2 \\implies {}^{5^2}\\log(5^1) = \\frac{1}{2}.',
    explanationLatex: '{}^{5^2}\\log(5^1) = \\frac{1}{2} \\cdot {}^5\\log(5) = \\frac{1}{2}',
    options: ['1/5', '1/2', '2', '5'],
    optionsLatex: ['\\frac{1}{5}', '\\frac{1}{2}', '2', '5'],
    correctIndex: 1, // 1/2
    category: 'Pangkat Numerus',
    difficulty: 'Mudah',
  },
  {
    id: 'q12',
    expression: '{}^2\\log(48) + {}^2\\log(3) - {}^2\\log(9)',
    equationLatex: '{}^2\\log(48) + {}^2\\log(3) - {}^2\\log(9) = \\dots',
    plainText: '^2log(48) + ^2log(3) - ^2log(9) = ...',
    explanation: '{}^2\\log\\left(\\frac{48 \\times 3}{9}\\right) = {}^2\\log(16) = 4.',
    explanationLatex: '{}^2\\log\\left(\\frac{48 \\times 3}{9}\\right) = {}^2\\log(16) = 4',
    options: ['3', '4', '5', '8'],
    optionsLatex: ['3', '4', '5', '8'],
    correctIndex: 1, // 4
    category: 'Penjumlahan & Selisih',
    difficulty: 'Sedang',
  },
  {
    id: 'q13',
    expression: '{}^3\\log(2) \\times {}^2\\log(5) \\times {}^5\\log(27)',
    equationLatex: '{}^3\\log(2) \\times {}^2\\log(5) \\times {}^5\\log(27) = \\dots',
    plainText: '^3log(2) × ^2log(5) × ^5log(27) = ...',
    explanation: 'Rantai logaritma: {}^3\\log(27) = {}^3\\log(3^3) = 3.',
    explanationLatex: '{}^3\\log(2) \\times {}^2\\log(5) \\times {}^5\\log(27) = {}^3\\log(27) = 3',
    options: ['1', '2', '3', '9'],
    optionsLatex: ['1', '2', '3', '9'],
    correctIndex: 2, // 3
    category: 'Perkalian & Basis',
    difficulty: 'Sedang',
  },
  {
    id: 'q14',
    expression: '{}^4\\log(64)',
    equationLatex: '{}^4\\log(64) = \\dots',
    plainText: '^4log(64) = ...',
    explanation: '64 = 4^3 \\implies {}^4\\log(4^3) = 3.',
    explanationLatex: '64 = 4^3 \\implies {}^4\\log(4^3) = 3',
    options: ['2', '3', '4', '16'],
    optionsLatex: ['2', '3', '4', '16'],
    correctIndex: 1, // 3
    category: 'Sifat Dasar',
    difficulty: 'Mudah',
  },
  {
    id: 'q15',
    expression: '\\log(1000)',
    equationLatex: '\\log(1000) = \\dots',
    plainText: 'log(1000) = ...',
    explanation: 'Logaritma umum basis 10: 1000 = 10^3 \\implies \\log(10^3) = 3.',
    explanationLatex: '1000 = 10^3 \\implies \\log_{10}(10^3) = 3',
    options: ['2', '3', '4', '10'],
    optionsLatex: ['2', '3', '4', '10'],
    correctIndex: 1, // 3
    category: 'Sifat Dasar',
    difficulty: 'Mudah',
  }
];

export const FORMULA_CHEATSHEET = [
  {
    title: 'Sifat Dasar',
    latex: '{}^a\\log(a) = 1 \\quad \\text{dan} \\quad {}^a\\log(1) = 0',
    desc: 'Logaritma bilangan terhadap basisnya sendiri bernilai 1, dan logaritma dari 1 selalu bernilai 0.',
  },
  {
    title: 'Penjumlahan (Perkalian Numerus)',
    latex: '{}^a\\log(b) + {}^a\\log(c) = {}^a\\log(b \\times c)',
    desc: 'Jika bilangan basis sama, penjumlahan dua logaritma setara dengan logaritma hasil kali numerusnya.',
  },
  {
    title: 'Pengurangan (Pembagian Numerus)',
    latex: '{}^a\\log(b) - {}^a\\log(c) = {}^a\\log\\left(\\frac{b}{c}\\right)',
    desc: 'Jika bilangan basis sama, pengurangan dua logaritma setara dengan logaritma hasil bagi numerusnya.',
  },
  {
    title: 'Pangkat Numerus & Pangkat Basis',
    latex: '{}^{a^m}\\log(b^n) = \\frac{n}{m} \\cdot {}^a\\log(b)',
    desc: 'Pangkat numerus n maju ke pembilang, pangkat basis m maju ke penyebut sebagai faktor pengali.',
  },
  {
    title: 'Perkalian Berantai (Perubahan Basis)',
    latex: '{}^a\\log(b) \\times {}^b\\log(c) = {}^a\\log(c)',
    desc: 'Jika numerus logaritma pertama sama dengan basis logaritma kedua, bentuk tereduksi menjadi basis pertama dan numerus terakhir.',
  },
  {
    title: 'Persamaan Logaritma',
    latex: '{}^a\\log(f(x)) = {}^a\\log(g(x)) \\implies f(x) = g(x) \\quad (f(x), g(x) > 0)',
    desc: 'Kedua fungsi numerus disamakan dengan memastikan syarat numerus selalu bernilai positif.',
  },
  {
    title: 'Pembalikan Basis',
    latex: '{}^a\\log(b) = \\frac{1}{{}^b\\log(a)}',
    desc: 'Menukar letak basis dan numerus menghasilkan nilai kebalikan (1/x).',
  },
  {
    title: 'Pangkat dengan Pangkat Logaritma',
    latex: 'a^{{}^a\\log(b)} = b',
    desc: 'Jika basis bilangan pokok sama dengan basis logaritma pada pangkatnya, hasilnya adalah numerus b.',
  }
];
