import { create } from "zustand";
import type { ChapterId } from "@/data/chapters";

export type OpeningPhase =
  | "silence"
  | "mark"
  | "invite"
  | "unlock"
  | "card"
  | "flip"
  | "butterfly"
  | "portal"
  | "done";

export type EntrySource = "web" | "nfc";
export type Locale = "zh" | "en" | "fr";
export type ToastKind = "success" | "error" | "info" | "warning";

export type StoryToast = {
  id: number;
  kind: ToastKind;
  text: string;
};

let toastSeq = 1;

type StoryState = {
  entered: boolean;
  audioUnlocked: boolean;
  musicEnabled: boolean;
  progress: number;
  chapterId: ChapterId;
  chapterLocal: number;
  intensity: number;
  reducedMotion: boolean;
  lowPower: boolean;
  openingPhase: OpeningPhase;
  worldReveal: number;
  entrySource: EntrySource;
  visitCount: number;
  bootReady: boolean;
  locale: Locale;
  volume: number;
  playerOpen: boolean;
  toasts: StoryToast[];
  setEntered: (v: boolean) => void;
  setAudioUnlocked: (v: boolean) => void;
  setMusicEnabled: (v: boolean) => void;
  setProgress: (v: number) => void;
  setChapterId: (id: ChapterId) => void;
  setChapterLocal: (v: number) => void;
  setIntensity: (v: number) => void;
  setReducedMotion: (v: boolean) => void;
  setLowPower: (v: boolean) => void;
  setOpeningPhase: (p: OpeningPhase) => void;
  setWorldReveal: (v: number) => void;
  setEntrySource: (s: EntrySource) => void;
  setVisitCount: (n: number) => void;
  setBootReady: (v: boolean) => void;
  setLocale: (locale: Locale) => void;
  setVolume: (volume: number) => void;
  setPlayerOpen: (playerOpen: boolean) => void;
  pushToast: (kind: ToastKind, text: string) => void;
  dismissToast: (id: number) => void;
};

export const useStoryStore = create<StoryState>((set) => ({
  entered: false,
  audioUnlocked: false,
  musicEnabled: true,
  progress: 0,
  chapterId: "opening",
  chapterLocal: 0,
  intensity: 0,
  reducedMotion: false,
  lowPower: false,
  openingPhase: "silence",
  worldReveal: 0,
  entrySource: "web",
  visitCount: 1,
  bootReady: false,
  locale: "zh",
  volume: 0.72,
  playerOpen: false,
  toasts: [],
  setEntered: (entered) => set({ entered }),
  setAudioUnlocked: (audioUnlocked) => set({ audioUnlocked }),
  setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
  setProgress: (progress) => set({ progress }),
  setChapterId: (chapterId) => set({ chapterId }),
  setChapterLocal: (chapterLocal) => set({ chapterLocal }),
  setIntensity: (intensity) => set({ intensity }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setLowPower: (lowPower) => set({ lowPower }),
  setOpeningPhase: (openingPhase) => set({ openingPhase }),
  setWorldReveal: (worldReveal) => set({ worldReveal }),
  setEntrySource: (entrySource) => set({ entrySource }),
  setVisitCount: (visitCount) => set({ visitCount }),
  setBootReady: (bootReady) => set({ bootReady }),
  setLocale: (locale) => set({ locale }),
  setVolume: (volume) => set({ volume }),
  setPlayerOpen: (playerOpen) => set({ playerOpen }),
  pushToast: (kind, text) =>
    set((s) => ({
      toasts: [...s.toasts, { id: toastSeq++, kind, text }].slice(-4),
    })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
