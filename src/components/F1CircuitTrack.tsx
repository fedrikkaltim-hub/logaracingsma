import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Student } from '../types/game';

interface F1CircuitTrackProps {
  students: Student[];
  currentLap?: number;
  totalLaps?: number;
  highlightedStudentId?: string;
  onSelectStudent?: (studentId: string) => void;
  height?: string | number;
}

export const F1CircuitTrack: React.FC<F1CircuitTrackProps> = ({
  students,
  currentLap = 1,
  totalLaps = 3,
  highlightedStudentId,
  onSelectStudent,
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(1000);

  // Smooth realistic Grand Prix circuit path (viewBox 0 0 1000 560)
  // DRS Straight -> Turn 1/2 Chicane -> Fast Sweeper -> Hairpin -> S-Curves -> Back Straight -> Parabolica -> Finish Line
  const circuitPathD = useMemo(() => {
    return `M 200 480 
            L 740 480 
            C 860 480, 920 420, 920 340 
            C 920 260, 840 220, 750 220 
            L 640 220 
            C 580 220, 560 170, 600 120 
            C 640 70, 740 70, 820 100 
            C 880 120, 930 90, 930 50 
            C 930 20, 890 20, 820 20 
            L 280 20 
            C 180 20, 100 80, 100 180 
            C 100 250, 150 290, 220 300 
            C 290 310, 320 360, 280 400 
            C 240 440, 150 430, 130 480 
            Z`;
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [circuitPathD]);

  // Calculate coordinates for all students along the track
  const studentCoordinates = useMemo(() => {
    if (!pathRef.current || pathLength <= 0) return [];

    return students.map((student, idx) => {
      // Total race progress normalized (0 to 1)
      const lapProgress = (student.progress || 0) / 100;
      const totalProgress = ((student.currentLap - 1) + lapProgress) / totalLaps;
      const clampedNormalized = Math.min(Math.max(lapProgress, 0), 0.999);
      
      const distance = clampedNormalized * pathLength;
      const point = pathRef.current!.getPointAtLength(distance);

      // Lane offset calculation for multiple cars
      const angle = (idx % 3 - 1) * 12; // -12, 0, +12 px perpendicular offset
      
      return {
        ...student,
        x: point.x + angle,
        y: point.y + (idx % 2 === 0 ? -4 : 4),
        totalProgress,
      };
    });
  }, [students, pathLength, totalLaps]);

  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-100/80 rounded-2xl border border-slate-200/80 overflow-hidden shadow-inner flex flex-col">
      {/* Track HUD Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/90 backdrop-blur-sm border-b border-slate-200 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-md">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-rose-700 tracking-wider font-racing">CIRCUIT DE LOGARITMA GP</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Panjang: 5.412 km · 16 Tikungan</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Sektor 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>Sektor 2 (DRS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Sektor 3 (Chicane)</span>
          </div>
          <div className="pl-2 border-l border-slate-300 font-racing font-bold text-slate-800">
            LAP {currentLap}/{totalLaps}
          </div>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        <svg
          viewBox="0 0 1020 520"
          className="w-full h-full max-h-[500px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Kerb stripe pattern */}
            <pattern id="kerbPattern" width="20" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="10" height="8" fill="#EF4444" />
              <rect x="10" width="10" height="8" fill="#FFFFFF" />
            </pattern>

            {/* Checkered Start/Finish Line pattern */}
            <pattern id="checkeredLine" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#1E293B" />
              <rect x="8" width="8" height="8" fill="#FFFFFF" />
              <rect y="8" width="8" height="8" fill="#FFFFFF" />
              <rect x="8" y="8" width="8" height="8" fill="#1E293B" />
            </pattern>

            {/* Track glow filter */}
            <filter id="trackGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#94a3b8" floodOpacity="0.25" />
            </filter>
            
            <filter id="carGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grass & Runoff runoff gravel background layers */}
          <rect x="0" y="0" width="1020" height="520" fill="transparent" />

          {/* Outer Track Kerb Buffer / Gravel runoffs */}
          <path
            d={circuitPathD}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="56"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Red & White Curbs around apexes */}
          <path
            d={circuitPathD}
            fill="none"
            stroke="url(#kerbPattern)"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40 120"
          />

          {/* Main Asphalt Circuit Track surface */}
          <path
            ref={pathRef}
            d={circuitPathD}
            fill="none"
            stroke="#334155"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trackGlow)"
          />

          {/* Track Center Guidance Dash Line */}
          <path
            d={circuitPathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="14 18"
            opacity="0.65"
          />

          {/* DRS Zone Highlighting on Main Straight */}
          <path
            d="M 240 480 L 700 480"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Start / Finish Line Grid Gantry */}
          <g transform="translate(190, 458)">
            <rect x="0" y="0" width="14" height="44" fill="url(#checkeredLine)" stroke="#0F172A" strokeWidth="1" />
            <text x="20" y="26" fill="#0F172A" fontSize="11" fontWeight="800" fontFamily="Chakra Petch, sans-serif">
              START / FINISH
            </text>
          </g>

          {/* Corner Numbers / Sector markers */}
          <g opacity="0.85" className="text-slate-400 font-mono text-[10px]">
            <circle cx="860" cy="420" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="860" y="424" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">T1</text>

            <circle cx="750" cy="220" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="750" y="224" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">T4</text>

            <circle cx="600" cy="120" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="600" y="124" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">T7</text>

            <circle cx="100" cy="180" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="100" y="184" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">T12</text>
          </g>

          {/* Students Circular Colored Racer Markers on Track */}
          {studentCoordinates.map((student, index) => {
            const isHighlighted = student.id === highlightedStudentId;
            const initials = student.name
              ? student.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
              : `P${index + 1}`;

            return (
              <g
                key={student.id}
                transform={`translate(${student.x}, ${student.y})`}
                className="transition-all duration-300 cursor-pointer"
                onClick={() => onSelectStudent?.(student.id)}
                filter="url(#carGlow)"
              >
                {/* Halo pulse ring for active/highlighted */}
                {isHighlighted && (
                  <circle
                    r="22"
                    fill="none"
                    stroke={student.carColor || '#E10600'}
                    strokeWidth="2.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Outer shadow ring */}
                <circle
                  r={isHighlighted ? 17 : 14}
                  fill="#FFFFFF"
                  stroke={student.carColor || '#E10600'}
                  strokeWidth="3"
                  className="transition-all duration-200"
                />

                {/* Primary colored circle */}
                <circle
                  r={isHighlighted ? 13 : 11}
                  fill={student.carColor || '#E10600'}
                />

                {/* Car number or Initials inside circle */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#FFFFFF"
                  fontSize={isHighlighted ? 10 : 9}
                  fontWeight="bold"
                  fontFamily="Chakra Petch, sans-serif"
                >
                  {student.carNumber || initials}
                </text>

                {/* Floating Name Tag Pill on Hover or Highlight */}
                <g transform="translate(0, -22)">
                  <rect
                    x={-((student.name.length * 4) + 12)}
                    y="-12"
                    width={(student.name.length * 8) + 24}
                    height="18"
                    rx="9"
                    fill={isHighlighted ? '#0F172A' : '#FFFFFF'}
                    stroke={student.carColor || '#E10600'}
                    strokeWidth="1.5"
                  />
                  <text
                    textAnchor="middle"
                    dy="1"
                    fontSize="9.5"
                    fontWeight="700"
                    fill={isHighlighted ? '#FFFFFF' : '#0F172A'}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {student.name} #{student.carNumber || index + 1}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Empty Track State (When 0 students online) */}
        {students.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/70 backdrop-blur-[2px]">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-md text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-racing">Sirkuit Bersih · 0 Mobil di Grid</h3>
              <p className="text-xs text-slate-500 mt-1">
                Belum ada siswa yang bergabung ke room balap. Bagikan kode ruangan atau gunakan tombol simulasi siswa untuk memulai uji coba.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Track Footer Telemetry Bar */}
      <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800">Total Pembalap di Lintasan:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-900">
            {students.length} Siswa Online
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span>Representasi:</span>
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Lingkaran Warna & Label Nama
          </span>
        </div>
      </div>
    </div>
  );
};
