import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Student {
  id: string;
  name: string;
  carColor: string;
  secondaryColor: string;
  carNumber: number;
  teamName: string;
  isReady: boolean;
  progress: number;
  currentLap: number;
  isFinished: boolean;
  finishRank?: number;
  finishTime?: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  speedKmh: number;
  gear: number;
  rpm: number;
  lastAnswerStatus: 'correct' | 'wrong' | 'idle';
  lastAnswerTime?: number;
}

interface RaceState {
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  roomCode: string;
  roomName: string;
  totalLaps: number;
  totalQuestions: number;
  maxFinishers: number;
  countdownValue: number;
  startTime: number | null;
  elapsedSeconds: number;
  flagStatus: 'GREEN' | 'YELLOW' | 'SAFETY_CAR' | 'CHECKERED';
  finishersCount: number;
}

// In-Memory Real-time State
let activeStudents: Student[] = [];

let currentRaceState: RaceState = {
  status: 'waiting',
  roomCode: 'F1-MATH',
  roomName: 'Logaritma GP Kelas X & XI',
  totalLaps: 1,
  totalQuestions: 10,
  maxFinishers: 10,
  countdownValue: 5,
  startTime: null,
  elapsedSeconds: 0,
  flagStatus: 'GREEN',
  finishersCount: 0,
};

// SSE Client list
interface SSEClient {
  id: number;
  res: Response;
}
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastSSE(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // SSE Real-time stream endpoint
  app.get('/api/events', (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const clientId = nextClientId++;
    const newClient: SSEClient = { id: clientId, res };
    sseClients.push(newClient);

    // Send initial full state immediately
    const initPayload = `event: INITIAL_STATE\ndata: ${JSON.stringify({
      students: activeStudents,
      raceState: currentRaceState,
    })}\n\n`;
    res.write(initPayload);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c.id !== clientId);
    });
  });

  // Keep-alive heartbeat for SSE every 15s
  setInterval(() => {
    sseClients.forEach((client) => {
      try {
        client.res.write(': heartbeat\n\n');
      } catch {
        // ignore
      }
    });
  }, 15000);

  // REST API: Get current room state
  app.get('/api/state', (_req: Request, res: Response) => {
    res.json({
      students: activeStudents,
      raceState: currentRaceState,
    });
  });

  // REST API: Student join / update identity
  app.post('/api/students/join', (req: Request, res: Response) => {
    const student: Student = req.body;
    if (!student || !student.id) {
      return res.status(400).json({ error: 'Data siswa tidak valid' });
    }

    const existingIdx = activeStudents.findIndex((s) => s.id === student.id);
    if (existingIdx >= 0) {
      activeStudents[existingIdx] = {
        ...activeStudents[existingIdx],
        ...student,
      };
    } else {
      if (activeStudents.length >= 50) {
        return res.status(400).json({ error: 'Kapasitas kelas penuh (maksimal 50 siswa)' });
      }
      activeStudents.push(student);
    }

    broadcastSSE('STUDENT_JOIN', { student, students: activeStudents });
    res.json({ success: true, student, raceState: currentRaceState });
  });

  // REST API: Toggle Student Ready
  app.post('/api/students/ready', (req: Request, res: Response) => {
    const { studentId, isReady } = req.body;
    const student = activeStudents.find((s) => s.id === studentId);
    if (student) {
      student.isReady = isReady;
      broadcastSSE('STUDENT_READY_TOGGLE', { studentId, isReady, students: activeStudents });
      return res.json({ success: true, student });
    }
    res.status(404).json({ error: 'Siswa tidak ditemukan' });
  });

  // REST API: Update student progress / answer
  app.post('/api/students/update', (req: Request, res: Response) => {
    const updated: Student = req.body;
    if (!updated || !updated.id) {
      return res.status(400).json({ error: 'Data siswa tidak valid' });
    }

    const idx = activeStudents.findIndex((s) => s.id === updated.id);
    if (idx >= 0) {
      // Check finish status
      let isNewlyFinished = false;
      if (updated.isFinished && !activeStudents[idx].isFinished) {
        isNewlyFinished = true;
        currentRaceState.finishersCount += 1;
        updated.finishRank = currentRaceState.finishersCount;
      }

      activeStudents[idx] = updated;

      // Check if 10 finishers reached
      if (currentRaceState.finishersCount >= 10 && currentRaceState.status === 'racing') {
        currentRaceState.status = 'finished';
        currentRaceState.flagStatus = 'CHECKERED';
        broadcastSSE('RACE_FINISH', { raceState: currentRaceState, students: activeStudents });
      }

      broadcastSSE('STUDENT_UPDATE', { student: updated, students: activeStudents });
      return res.json({ success: true, student: updated, raceState: currentRaceState });
    }

    // New student answering directly during ongoing race (late joiner allowed!)
    if (activeStudents.length < 50) {
      activeStudents.push(updated);
      broadcastSSE('STUDENT_JOIN', { student: updated, students: activeStudents });
      return res.json({ success: true, student: updated, raceState: currentRaceState });
    }

    res.status(404).json({ error: 'Siswa tidak ditemukan' });
  });

  // REST API: Teacher starts countdown
  app.post('/api/race/countdown', (req: Request, res: Response) => {
    const { countdown } = req.body;
    currentRaceState.status = 'countdown';
    currentRaceState.countdownValue = countdown ?? 5;
    broadcastSSE('RACE_COUNTDOWN_START', { countdown: currentRaceState.countdownValue, raceState: currentRaceState });
    res.json({ success: true, raceState: currentRaceState });
  });

  // REST API: Teacher starts race
  app.post('/api/race/start', (_req: Request, res: Response) => {
    currentRaceState.status = 'racing';
    currentRaceState.countdownValue = 0;
    currentRaceState.startTime = Date.now();
    currentRaceState.finishersCount = 0;
    broadcastSSE('RACE_START', { raceState: currentRaceState, students: activeStudents });
    res.json({ success: true, raceState: currentRaceState });
  });

  // REST API: Teacher resets race
  app.post('/api/race/reset', (_req: Request, res: Response) => {
    currentRaceState = {
      status: 'waiting',
      roomCode: 'F1-MATH',
      roomName: 'Logaritma GP Kelas X & XI',
      totalLaps: 1,
      totalQuestions: 10,
      maxFinishers: 10,
      countdownValue: 5,
      startTime: null,
      elapsedSeconds: 0,
      flagStatus: 'GREEN',
      finishersCount: 0,
    };

    activeStudents = activeStudents.map((s) => ({
      ...s,
      progress: 0,
      currentLap: 1,
      isFinished: false,
      finishRank: undefined,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      speedKmh: 0,
      lastAnswerStatus: 'idle',
    }));

    broadcastSSE('RACE_RESET', { raceState: currentRaceState, students: activeStudents });
    res.json({ success: true, raceState: currentRaceState, students: activeStudents });
  });

  // REST API: Clear all students
  app.post('/api/race/clear-students', (_req: Request, res: Response) => {
    activeStudents = [];
    currentRaceState.finishersCount = 0;
    broadcastSSE('STUDENTS_CLEARED', { students: [], raceState: currentRaceState });
    res.json({ success: true });
  });

  // Mount Vite or serve static files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`> LogaRacing Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
