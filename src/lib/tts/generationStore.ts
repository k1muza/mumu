"use client";

import { create } from "zustand";
import type { VoiceId } from "./protocol";

export type AudioGenerationPhase = "idle" | "generating" | "stopping";

interface AudioGenerationState {
  jobId: number;
  phase: AudioGenerationPhase;
  voice: VoiceId | null;
  completed: number;
  total: number;
  error: string | null;
  start: (voice: VoiceId) => void;
  stop: () => void;
  setProgress: (jobId: number, completed: number, total: number) => void;
  finish: (jobId: number) => void;
  fail: (jobId: number, error: string) => void;
}

/** Shared state for the single app-wide audio-generation job. */
export const useAudioGenerationStore = create<AudioGenerationState>((set, get) => ({
  jobId: 0,
  phase: "idle",
  voice: null,
  completed: 0,
  total: 0,
  error: null,

  start: (voice) => {
    if (get().phase !== "idle") return;
    set((state) => ({
      jobId: state.jobId + 1,
      phase: "generating",
      voice,
      completed: 0,
      total: 0,
      error: null,
    }));
  },

  stop: () => {
    if (get().phase === "generating") set({ phase: "stopping" });
  },

  setProgress: (jobId, completed, total) => {
    if (get().jobId === jobId) set({ completed, total });
  },

  finish: (jobId) => {
    if (get().jobId === jobId) set({ phase: "idle" });
  },

  fail: (jobId, error) => {
    if (get().jobId === jobId) set({ phase: "idle", error });
  },
}));
