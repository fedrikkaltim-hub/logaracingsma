/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewRole, Student, RaceState } from './types/game';
import { TopNav } from './components/TopNav';
import { RoleSelectionView } from './components/RoleSelectionView';
import { StudentGarageView } from './components/StudentGarageView';
import { TeacherControlView } from './components/TeacherControlView';
import { StudentCockpitView } from './components/StudentCockpitView';
import { ConceptBoardView } from './components/ConceptBoardView';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { soundManager } from './utils/audio';
import { apiSync } from './utils/apiSync';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewRole>('concept_board');
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('logaracing_teacher_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState(false);

  // Real-time active students from server
  const [students, setStudents] = useState<Student[]>([]);

  // Current active driver on this specific client/browser
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem('logaracing_my_student_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [raceState, setRaceState] = useState<RaceState>({
    status: 'waiting',
    roomCode: 'F1-MATH',
    roomName: 'Logaritma GP Kelas X & XI',
    totalLaps: 1, // Strictly 1 Lap
    totalQuestions: 10, // 10 questions required to finish
    maxFinishers: 10, // Max 10 finishers
    countdownValue: 5,
    startTime: null,
    elapsedSeconds: 0,
    flagStatus: 'GREEN',
    finishersCount: 0,
  });

  const currentViewRef = useRef(currentView);
  currentViewRef.current = currentView;

  const currentStudentRef = useRef(currentStudent);
  currentStudentRef.current = currentStudent;

  // Initialize Real-time API / SSE Sync across all devices (Runs once)
  useEffect(() => {
    apiSync.init({
      onStudentsUpdate: (serverStudents) => {
        setStudents(serverStudents);
        // Sync my student profile if already joined
        const myStudent = currentStudentRef.current;
        if (myStudent) {
          const match = serverStudents.find((s) => s.id === myStudent.id);
          if (match) {
            setCurrentStudent(match);
          }
        }
      },
      onRaceStateUpdate: (serverRaceState) => {
        setRaceState(serverRaceState);
      },
      onCountdownStart: (countdown) => {
        setRaceState((prev) => ({
          ...prev,
          status: 'countdown',
          countdownValue: countdown,
        }));
        if (countdown > 0) {
          soundManager.playRedLightBeep();
        }
      },
      onRaceStart: () => {
        setRaceState((prev) => ({
          ...prev,
          status: 'racing',
          countdownValue: 0,
          startTime: Date.now(),
        }));
        soundManager.playGreenGoBeep();
        if (currentViewRef.current === 'student_garage') {
          setCurrentView('student_cockpit');
        }
      },
      onRaceFinish: () => {
        setRaceState((prev) => ({
          ...prev,
          status: 'finished',
          flagStatus: 'CHECKERED',
        }));
      },
      onRaceReset: () => {
        setRaceState({
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
        });
      },
    });

    return () => {
      apiSync.destroy();
    };
  }, []);

  // Persist current student profile locally on this device
  useEffect(() => {
    if (currentStudent) {
      try {
        localStorage.setItem('logaracing_my_student_profile', JSON.stringify(currentStudent));
      } catch {
        // ignore
      }
    }
  }, [currentStudent]);

  // Navigation interceptor for Teacher Room authentication
  const handleNavigate = (view: ViewRole) => {
    if (view === 'teacher_room') {
      if (!isTeacherAuthenticated) {
        setShowTeacherAuthModal(true);
        return;
      }
    }
    setCurrentView(view);
  };

  const handleTeacherAuthSuccess = () => {
    setIsTeacherAuthenticated(true);
    try {
      sessionStorage.setItem('logaracing_teacher_auth', 'true');
    } catch {
      // ignore
    }
    setShowTeacherAuthModal(false);
    setCurrentView('teacher_room');
  };

  const handleLogoutTeacher = () => {
    setIsTeacherAuthenticated(false);
    try {
      sessionStorage.removeItem('logaracing_teacher_auth');
    } catch {
      // ignore
    }
    soundManager.stopF1Theme();
    setCurrentView('role_select');
  };

  // Handle Save / Update Student across network
  const handleSaveStudent = useCallback(async (student: Student) => {
    setCurrentStudent(student);
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === student.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = student;
        return next;
      }
      return [...prev, student];
    });

    // Real-time API backend sync
    await apiSync.joinStudent(student);
  }, []);

  const handleUpdateStudentProgress = useCallback(async (student: Student) => {
    setCurrentStudent(student);
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === student.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = student;
        return next;
      }
      return [...prev, student];
    });

    // Send real-time progress update to server
    await apiSync.updateStudent(student);
  }, []);

  const handleToggleReady = useCallback(async (isReady: boolean) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, isReady };
    setCurrentStudent(updated);
    await apiSync.toggleReady(currentStudent.id, isReady);
  }, [currentStudent]);

  // Teacher initiates race countdown
  const handleStartRaceCountdown = useCallback(async () => {
    let count = 5;
    await apiSync.sendCountdown(5);
    soundManager.playRedLightBeep();

    const interval = setInterval(async () => {
      count -= 1;
      if (count > 0) {
        await apiSync.sendCountdown(count);
        soundManager.playRedLightBeep();
      } else {
        clearInterval(interval);
        soundManager.playGreenGoBeep();
        await apiSync.startRace();
      }
    }, 1000);
  }, []);

  const handleResetRace = useCallback(async () => {
    await apiSync.resetRace();
  }, []);

  const handleClearStudents = useCallback(async () => {
    await apiSync.clearStudents();
    setStudents([]);
    setCurrentStudent(null);
    try {
      localStorage.removeItem('logaracing_my_student_profile');
    } catch {
      // ignore
    }
  }, []);

  const handleToggleMute = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const activeDriver: Student = currentStudent || {
    id: 'student_player_1',
    name: 'Pembalap F1',
    carColor: '#E10600',
    secondaryColor: '#FFE600',
    carNumber: 33,
    teamName: 'Scuderia Red Bull',
    isReady: true,
    progress: 0,
    currentLap: 1,
    isFinished: false,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    speedKmh: 285,
    gear: 7,
    rpm: 11500,
    lastAnswerStatus: 'idle',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <TopNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onlineCount={students.length}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      <main className="flex-1 w-full">
        {currentView === 'concept_board' && (
          <ConceptBoardView
            onNavigate={handleNavigate}
            students={students}
          />
        )}

        {currentView === 'role_select' && (
          <RoleSelectionView
            onSelectRole={handleNavigate}
            onRequestTeacherAccess={() => {
              if (isTeacherAuthenticated) {
                setCurrentView('teacher_room');
              } else {
                setShowTeacherAuthModal(true);
              }
            }}
            onlineCount={students.length}
            roomCode={raceState.roomCode}
          />
        )}

        {currentView === 'student_garage' && (
          <StudentGarageView
            currentStudent={currentStudent}
            onSaveStudent={handleSaveStudent}
            onToggleReady={handleToggleReady}
            onNavigate={handleNavigate}
            raceStatus={raceState.status}
            countdownValue={raceState.countdownValue}
            roomCode={raceState.roomCode}
          />
        )}

        {currentView === 'teacher_room' && (
          <TeacherControlView
            students={students}
            raceState={raceState}
            onStartRaceCountdown={handleStartRaceCountdown}
            onResetRace={handleResetRace}
            onClearStudents={handleClearStudents}
            onNavigate={handleNavigate}
            onFinishRace={() => setRaceState((prev) => ({ ...prev, status: 'finished' }))}
            onLogoutTeacher={handleLogoutTeacher}
          />
        )}

        {currentView === 'student_cockpit' && (
          <StudentCockpitView
            student={activeDriver}
            onUpdateStudent={handleUpdateStudentProgress}
            onNavigate={handleNavigate}
            totalLaps={1}
            onStudentFinish={(finStudent) => {
              handleUpdateStudentProgress(finStudent);
            }}
          />
        )}
      </main>

      {/* Teacher Authentication Login Modal */}
      <TeacherAuthModal
        isOpen={showTeacherAuthModal}
        onClose={() => setShowTeacherAuthModal(false)}
        onSuccess={handleTeacherAuthSuccess}
      />
    </div>
  );
}
