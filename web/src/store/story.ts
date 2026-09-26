import { create } from "zustand";
import type { ChapterId } from "@/data/chapters";

type StoryState = {
  entered: boolean;
  audioUnlocked: boolean;
  musicEnabled: boolean;
  progress: number;
  chapterId: ChapterId;
  intensity: number;
  reducedMotion: boolean;
  setEntered: (v: boolean) => void;
  setAudioUnlocked: (v: boolean) => void;
  setMusicEnabled: (v: boolean) => void;
  setProgress: (v: number) => void;
  setChapterId: (id: ChapterId) => void;
  setIntensity: (v: number) => void;
  setReducedMotion: (v: boolean) => void;
};

export const useStoryStore = create<StoryState>((set) => ({
  entered: false,
  audioUnlocked: false,
  musicEnabled: true,
  progress: 0,
  chapterId: "opening",
  intensity: 0,
  reducedMotion: false,
  setEntered: (entered) => set({ entered }),
  setAudioUnlocked: (audioUnlocked) => set({ audioUnlocked }),
  setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
  setProgress: (progress) => set({ progress }),
  setChapterId: (chapterId) => set({ chapterId }),
  setIntensity: (intensity) => set({ intensity }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
