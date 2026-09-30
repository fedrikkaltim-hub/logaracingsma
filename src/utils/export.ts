import { Student } from '../types/game';

export function exportStudentsToCSV(students: Student[], roomCode: string) {
  const headers = [
    'Peringkat',
    'Nomor Mobil',
    'Nama Siswa',
    'Tim Balap',
    'Skor Akhir (Pts)',
    'Jawaban Benar',
    'Jawaban Salah',
    'Total Soal Dikerjakan',
    'Akurasi (%)',
    'Status Balapan',
    'Kecepatan Tertinggi',
    'Streak Terbaik'
  ];

  const sorted = [...students].sort((a, b) => {
    if (a.isFinished && !b.isFinished) return -1;
    if (!a.isFinished && b.isFinished) return 1;
    if (a.isFinished && b.isFinished) return (a.finishRank || 99) - (b.finishRank || 99);
    return b.score - a.score;
  });

  const rows = sorted.map((s, index) => {
    const totalAttempted = (s.correctCount || 0) + (s.wrongCount || 0);
    const accuracy = totalAttempted > 0 ? ((s.correctCount / totalAttempted) * 100).toFixed(1) : '0.0';
    const rank = s.finishRank ? `P${s.finishRank}` : `P${index + 1}`;
    const status = s.isFinished ? 'FINISH' : 'DALAM LINTASAN';

    return [
      rank,
      `#${s.carNumber}`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.teamName}"`,
      s.score,
      s.correctCount || 0,
      s.wrongCount || 0,
      totalAttempted,
      `${accuracy}%`,
      status,
      `${s.speedKmh} km/h`,
      `${s.streak}x`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Hasil_LogaRacing_Room_${roomCode}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
