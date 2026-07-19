"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import FaIcon from "@/components/FaIcon";
import { db } from "@/lib/db";
import { useStoryEditMode } from "@/lib/storyEditMode";

/** Copy text to the clipboard, with a fallback for older browsers. */
export function copyText(text: string): void {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

interface StoryImageSlotProps {
  /** Persistence key — must be unique across all stories. */
  slotId: string;
  /** Full image-generation prompt for this slot. */
  prompt: string;
  /** Bundled artwork used when this slot has no browser-stored replacement. */
  defaultImage?: string;
  alt?: string;
  /** Where the chip cluster sits. */
  chipPos?: "top" | "bottom";
  /**
   * When false, clicking the slot body does nothing (for slots inside answer
   * buttons); uploading is still possible via the camera chip or drag & drop.
   */
  pickOnClick?: boolean;
  /** Icon-only chips for small tiles (question choices). */
  compact?: boolean;
}

/**
 * A user-fillable illustration slot. All editing (prompt chips, uploads,
 * drag & drop) only appears in grown-up edit mode — see storyEditMode.ts;
 * children just see the image or a friendly "coming soon" tile. Uploads
 * persist in the local database. Fills its nearest relatively-positioned
 * parent.
 */
export default function StoryImageSlot({
  slotId,
  prompt,
  defaultImage,
  alt = "",
  chipPos = "bottom",
  pickOnClick = true,
  compact = false,
}: StoryImageSlotProps) {
  const editing = useStoryEditMode();
  const record = useLiveQuery(() => db.storyImages.get(slotId), [slotId]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = useMemo(
    () => (record ? URL.createObjectURL(record.blob) : null),
    [record],
  );
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const save = (file: File | undefined | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    void db.storyImages.put({ id: slotId, blob: file });
  };

  // Chips render as spans with role="button": slots sit inside answer
  // <button>s and card <Link>s, where a nested <button> is invalid HTML.
  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 8px",
    borderRadius: 9,
    background: "rgba(15,25,35,.7)",
    color: "#fff",
    fontSize: 11,
    lineHeight: 1,
    backdropFilter: "blur(4px)",
    boxShadow: "0 2px 6px rgba(0,0,0,.3)",
    cursor: "pointer",
  };

  const chipKey = (action: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div
      className="absolute inset-0 group/slot"
      onClick={
        editing && pickOnClick && !record ? () => inputRef.current?.click() : undefined
      }
      onDragOver={(e) => {
        e.preventDefault();
        if (editing) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        // always swallow the drop so the browser never navigates to the file
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        if (editing) save(e.dataTransfer.files?.[0]);
      }}
      style={{
        cursor: editing && pickOnClick && !record ? "pointer" : undefined,
        outline: dragOver ? "3px dashed #1F97A6" : "none",
        outlineOffset: -3,
      }}
    >
      {url || defaultImage ? (
        <img
          src={url ?? defaultImage}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center"
          style={{ background: "repeating-linear-gradient(45deg,#EDF4F6 0 14px,#E4EEF1 14px 28px)" }}
        >
          <FaIcon name="image" className="text-[22px] text-[#9fb1bb]" />
          {!compact && !editing && (
            <span className="font-baloo font-extrabold text-[11px]" style={{ color: "#7d93a0" }}>
              Picture coming soon!
            </span>
          )}
          {!compact && editing && (
            <>
              <span className="font-baloo font-extrabold text-[11px]" style={{ color: "#7d93a0" }}>
                Drop an image here
              </span>
              <span
                className="font-bold text-[10px] leading-snug overflow-hidden"
                style={{
                  color: "#9fb1bb",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {prompt}
              </span>
            </>
          )}
        </div>
      )}

      {/* chip cluster (edit mode only) — on filled slots, hidden until hover */}
      {editing && (
      <div
        className={`absolute z-20 flex items-center gap-1 font-baloo font-extrabold ${
          record
            ? "opacity-0 transition-opacity group-hover/slot:opacity-100 group-focus-within/slot:opacity-100"
            : ""
        }`}
        style={chipPos === "top" ? { right: 7, top: 7 } : { right: 7, bottom: 7 }}
        onClick={(e) => {
          // Chips must never trigger the surrounding card link / answer button.
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span
          role="button"
          tabIndex={0}
          title="Copy image prompt"
          aria-label="Copy prompt"
          style={{ ...chipStyle, background: copied ? "rgba(46,125,36,.92)" : chipStyle.background }}
          onClick={() => {
            copyText(prompt);
            setCopied(true);
          }}
          onKeyDown={chipKey(() => {
            copyText(prompt);
            setCopied(true);
          })}
        >
          <FaIcon name="copy" className="text-[11px]" />
          {compact ? copied && "✓" : copied ? "Copied!" : "Copy prompt"}
        </span>
        <span
          role="button"
          tabIndex={0}
          title={record ? "Replace image" : "Upload image"}
          aria-label={record ? "Replace image" : "Upload image"}
          style={chipStyle}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <FaIcon name="camera" className="text-[11px]" />
        </span>
        {record && (
          <span
            role="button"
            tabIndex={0}
            title="Remove image"
            aria-label="Remove image"
            style={chipStyle}
            onClick={() => void db.storyImages.delete(slotId)}
            onKeyDown={chipKey(() => void db.storyImages.delete(slotId))}
          >
            <FaIcon name="xmark" className="text-[11px]" />
          </span>
        )}
      </div>
      )}

      {editing && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            save(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      )}
    </div>
  );
}
