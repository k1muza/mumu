"use client";

import { useSyncExternalStore } from "react";

/**
 * Story edit mode: unlocked by a grown-up (maths gate) to manage story
 * illustrations and prompts. Held in sessionStorage so it follows the tab
 * across story pages and reloads, but resets when the tab closes.
 */

const KEY = "lu_story_edit";
const EVENT = "lu-story-edit";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useStoryEditMode(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem(KEY) === "1",
    () => false,
  );
}

export function setStoryEditMode(on: boolean): void {
  sessionStorage.setItem(KEY, on ? "1" : "0");
  window.dispatchEvent(new Event(EVENT));
}
