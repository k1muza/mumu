"use client";

import { useEffect, useState } from "react";
import FaIcon from "@/components/FaIcon";

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type FullscreenRoot = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function activeFullscreenElement(doc: FullscreenDocument) {
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

/** Keeps the learning experience in a distraction-free browser view across routes. */
export default function FullscreenButton() {
  const [supported, setSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const doc = document as FullscreenDocument;
    const root = document.documentElement as FullscreenRoot;
    const syncState = () => {
      setSupported(
        document.fullscreenEnabled ||
          typeof root.requestFullscreen === "function" ||
          typeof root.webkitRequestFullscreen === "function",
      );
      setIsFullscreen(Boolean(activeFullscreenElement(doc)));
    };
    const handleError = () => setError("Full screen is not available in this browser.");

    queueMicrotask(syncState);
    document.addEventListener("fullscreenchange", syncState);
    document.addEventListener("webkitfullscreenchange", syncState);
    document.addEventListener("fullscreenerror", handleError);
    document.addEventListener("webkitfullscreenerror", handleError);

    return () => {
      document.removeEventListener("fullscreenchange", syncState);
      document.removeEventListener("webkitfullscreenchange", syncState);
      document.removeEventListener("fullscreenerror", handleError);
      document.removeEventListener("webkitfullscreenerror", handleError);
    };
  }, []);

  if (!supported) return null;

  const toggleFullscreen = async () => {
    const doc = document as FullscreenDocument;
    const root = document.documentElement as FullscreenRoot;
    setError("");

    try {
      if (activeFullscreenElement(doc)) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else await doc.webkitExitFullscreen?.();
      } else if (root.requestFullscreen) {
        await root.requestFullscreen({ navigationUI: "hide" });
      } else {
        await root.webkitRequestFullscreen?.();
      }
    } catch {
      setError("Full screen is not available in this browser.");
    }
  };

  return (
    <div className="lu-fullscreen-control" data-active={isFullscreen || undefined}>
      <button
        type="button"
        onClick={toggleFullscreen}
        className="lu-fullscreen-button"
        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        title={isFullscreen ? "Exit full screen" : "Full screen"}
      >
        <FaIcon name={isFullscreen ? "compress" : "expand"} />
        <span className="lu-fullscreen-label">
          {isFullscreen ? "Exit" : "Full screen"}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {error}
      </span>
    </div>
  );
}
