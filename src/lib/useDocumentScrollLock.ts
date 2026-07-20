"use client";

import { useEffect } from "react";

let activeLocks = 0;
let previousHtmlOverflow = "";
let previousBodyOverflow = "";

function lockDocumentScroll() {
  if (activeLocks === 0) {
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  activeLocks += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks === 0) {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    }
  };
}

/**
 * Locks page scrolling while one or more full-screen overlays are open.
 *
 * A shared lock count is important here: restoring a value captured by one
 * overlay while another overlay is also mounted can otherwise leave the
 * document permanently stuck at `overflow: hidden`.
 */
export function useDocumentScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    return lockDocumentScroll();
  }, [locked]);
}
