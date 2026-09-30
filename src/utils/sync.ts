import { Student, RaceState } from '../types/game';

const CHANNEL_NAME = 'logaracing_f1_channel_v2';
const STORAGE_KEY_STUDENTS = 'logaracing_active_students_v2';
const STORAGE_KEY_RACE = 'logaracing_race_state_v2';
const STORAGE_PING_KEY = 'logaracing_storage_ping_v2';

export type SyncMessage =
  | { type: 'STUDENT_JOIN'; student: Student }
  | { type: 'STUDENT_READY_TOGGLE'; studentId: string; isReady: boolean }
  | { type: 'STUDENT_UPDATE'; student: Student }
  | { type: 'STUDENT_LEAVE'; studentId: string }
  | { type: 'RACE_COUNTDOWN_START'; countdown: number }
  | { type: 'RACE_START' }
  | { type: 'RACE_FINISH' }
  | { type: 'RACE_RESET' }
  | { type: 'REQUEST_STATE' }
  | { type: 'SYNC_FULL_STATE'; students: Student[]; raceState: RaceState };

class SyncBus {
  private channel: BroadcastChannel | null = null;
  private listeners: ((msg: SyncMessage) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      if ('BroadcastChannel' in window) {
        try {
          this.channel = new BroadcastChannel(CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            if (event && event.data) {
              this.notifyListeners(event.data as SyncMessage);
            }
          };
        } catch {
          // ignore if disabled
        }
      }

      // Secondary fallback via storage event for cross-tab sync
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_PING_KEY && event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue) as { msg: SyncMessage; ts: number };
            if (parsed && parsed.msg) {
              this.notifyListeners(parsed.msg);
            }
          } catch {
            // ignore
          }
        }
      });
    }
  }

  private notifyListeners(msg: SyncMessage) {
    this.listeners.forEach((fn) => {
      try {
        fn(msg);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  broadcast(msg: SyncMessage) {
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch {
        // ignore
      }
    }

    // Ping storage event so all windows receive the message in real-time
    try {
      localStorage.setItem(
        STORAGE_PING_KEY,
        JSON.stringify({ msg, ts: Date.now() + Math.random() })
      );
    } catch {
      // ignore
    }
  }

  subscribe(callback: (msg: SyncMessage) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }

  // Local storage helpers for persistence
  getPersistedStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  savePersistedStudents(students: Student[]) {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch {
      // ignore
    }
  }

  getPersistedRaceState(): RaceState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RACE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  savePersistedRaceState(state: RaceState) {
    try {
      localStorage.setItem(STORAGE_KEY_RACE, JSON.stringify(state));
    } catch {
      // ignore
    }
  }
}

export const syncBus = new SyncBus();
