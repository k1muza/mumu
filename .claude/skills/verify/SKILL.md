---
name: verify
description: How to build, launch and drive the Learning Universe app to verify changes end-to-end.
---

# Verifying Learning Universe

## Build / launch
- `npm run build` — production build (Turbopack). TypeScript runs as part of it.
- `npm run dev` — dev server on port 3000. **Check if one is already running first**
  (a second instance exits with "Another next dev server is already running").

## Driving the app (Playwright)
A working driver lives at the scratchpad from the Kokoro TTS session:
`drive-tts.js` (copy the patterns, the file itself is session-temporary).

Key gotchas, all learned the hard way:
- **App state is client-side** (Dexie/IndexedDB). SSR HTML is always a loading
  skeleton; content appears only after hydration. Use `waitFor`, never `isVisible`
  (which ignores its timeout and returns immediately).
- **Onboarding gate** (`getByLabel("Your name")`) covers every route on a fresh
  profile and mounts late — wait for it with a long timeout on `/` first.
- **Parent settings** are behind a maths gate: parse "What is a + b?" from the DOM
  and click the sum. Speech toggle: `getByRole("switch", { name: /Read words aloud/ })`.
- **MUTE THE BROWSER**: `--mute-audio` AND stub `speechSynthesis.speak` in an init
  script. The Web Speech fallback goes through the Windows TTS engine and is
  audible on the machine's real speakers even from headless Chromium.
- Use `launchPersistentContext` with a profile dir so the ~90 MB Kokoro model stays
  cached between runs, and always `context.close()` (even on failure) — hard kills
  corrupt the profile's CacheStorage, which silently forces model re-downloads and
  causes flaky blank pages.
- Observe audio by patching `HTMLMediaElement.prototype.play` in an init script;
  Kokoro playback shows up as `blob:` URLs, the loading-fallback as synth calls.
- Storybook Library (English world): `/stories` (library) and `/stories/<storyId>`
  (reader). Content lives in `src/content/stories.ts`; uploaded illustrations and
  question star-credit persist in Dexie stores `storyImages` / `storyCredit` — clear
  both to reset between runs. Question choice tiles carry the scene description as
  `aria-label`, so target them with `getByRole("button", { name: /<scene text>/ })`.
  All editing UI (prompt chips, uploads, "Copy all prompts") is behind grown-up
  edit mode: click the header "Grown-ups" button and solve the maths gate (same
  parse-the-sum trick as /parent). Edit mode is sessionStorage `lu_story_edit`;
  clear it to return to the kid view. A working driver covering the whole flow:
  `drive-stories.js` in the 2026-07-17 session scratchpad.
- Lesson URLs: `/lesson/<subject>/<badgeSlug>?lesson=<order>` — **order is 0-based**.
  `english/sound-explorer` activity 1 has the "Tap to hear" button;
  `english/story-reader?lesson=1` has the long story prompt (streams as chunks).
- WASM generation is slow (~15–20 s/sentence in headless CPU): first clicks fall
  back to device speech until the model is ready — re-click in a poll loop until a
  `blob:` play appears; budget ~5 min for a cold model download.

## Known pre-existing noise
- Hydration error on `/parent` from the `Math.random()` maths gate — not a regression.
- Occasional dev-server stalls serving the 20 MB `/ort/*.wasm` (project lives in
  OneDrive); retry navigation with `waitUntil: "domcontentloaded"`.
