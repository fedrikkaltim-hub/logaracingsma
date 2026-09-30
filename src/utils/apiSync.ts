import { Student, RaceState } from '../types/game';

type SyncCallback = {
  onStudentsUpdate: (students: Student[]) => void;
  onRaceStateUpdate: (raceState: RaceState) => void;
  onCountdownStart: (countdown: number) => void;
  onRaceStart: () => void;
  onRaceFinish: () => void;
  onRaceReset: () => void;
};

const defaultRaceState = {
  status: 'idle',
  countdown: 0
} as RaceState;

class ApiSyncService {
  private callbacks: SyncCallback | null = null;
  private students: Student[] = [];
  private raceState: RaceState = defaultRaceState;

  init(callbacks: SyncCallback) {
    this.callbacks = callbacks;
    callbacks.onStudentsUpdate(this.students);
    callbacks.onRaceStateUpdate(this.raceState);
  }

  private sync() {
    this.callbacks?.onStudentsUpdate([...this.students]);
    this.callbacks?.onRaceStateUpdate({...this.raceState});
  }

  async joinStudent(student: Student) {
    this.students = [...this.students.filter(s => s.id !== student.id), student];
    this.sync();
    return { success: true, raceState: this.raceState };
  }

  async toggleReady(studentId: string, isReady: boolean) {
    this.students = this.students.map(s => s.id === studentId ? {...s, isReady}: s);
    this.sync();
  }

  async updateStudent(student: Student) {
    this.students = this.students.map(s => s.id === student.id ? student : s);
    this.sync();
    return { success: true };
  }

  async sendCountdown(countdown: number) {
    this.raceState = {...this.raceState, countdown};
    this.callbacks?.onCountdownStart(countdown);
    this.sync();
  }

  async startRace() {
    this.raceState = {...this.raceState, status: 'racing'};
    this.callbacks?.onRaceStart();
    this.sync();
  }

  async resetRace() {
    this.students = this.students.map(s => ({
      ...s, progress:0, score:0, correctCount:0, wrongCount:0,
      isFinished:false, finishRank:undefined
    }));
    this.raceState = defaultRaceState;
    this.callbacks?.onRaceReset();
    this.sync();
  }

  async clearStudents() {
    this.students = [];
    this.sync();
  }

  destroy() {}
}

export const apiSync = new ApiSyncService();
