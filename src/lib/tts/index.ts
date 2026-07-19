/**
 * Kokoro text-to-speech for words, sentences and stories.
 *
 * Audio is generated in a web worker (see tts.worker.ts) so the UI never
 * blocks. Short texts are generated in one clip and cached; long texts stream
 * sentence-by-sentence so playback starts before the whole story is rendered.
 * Until the model has loaded (first visit downloads ~90 MB, then it's cached),
 * speech falls back to the browser's built-in speechSynthesis.
 */
import { DEFAULT_VOICE, type VoiceId, type WorkerRequest, type WorkerResponse } from "./protocol";

/** Only cache short clips (words / prompts) — story audio is too big to keep. */
const CACHEABLE_CHARS = 120;
const CACHE_MAX = 40;

/**
 * TTS reads phonics notation like /t/ as "slash t slash", so before generating
 * audio each /…/ phoneme is swapped for a speakable approximation. Single
 * sounds map to how a phonics teacher voices them ("tuh", "sss"); rimes like
 * /at/ fall through unmapped and are read as the bare chunk ("at").
 */
const PHONEME_SOUNDS: Record<string, string> = {
  a: "ah", b: "buh", c: "kuh", d: "duh", e: "eh", f: "fff", g: "guh",
  h: "hah", i: "ih", j: "juh", k: "kuh", l: "lll", m: "mmm", n: "nnn",
  o: "aw", p: "puh", q: "kwuh", r: "rrr", s: "sss", t: "tuh", u: "uh",
  v: "vvv", w: "wuh", x: "ks", y: "yuh", z: "zzz",
  sh: "shh", ch: "chuh", th: "thh", ng: "ng",
};

function speakable(text: string): string {
  return text.replace(/\/([a-z]{1,3})\//gi, (_, p: string) => PHONEME_SOUNDS[p.toLowerCase()] ?? p);
}

type Pending = { resolve: (wav: ArrayBuffer) => void; reject: (err: Error) => void };
type StreamHandler = { onChunk: (blob: Blob) => void; onDone: () => void };
type SpeechOptions = { speed?: number; onPreparingChange?: (preparing: boolean) => void };
type NextRequest = {
  text: string;
  speed: number;
  onPreparingChange?: SpeechOptions["onPreparingChange"];
};
export type SpeechStatus = "idle" | "loading" | "ready" | "generating" | "failed";

class SpeechManager {
  private voice: VoiceId = DEFAULT_VOICE;
  private worker: Worker | null = null;
  private ready = false;
  private failed = false;
  private status: SpeechStatus = "idle";
  private listeners = new Set<() => void>();
  private preparingId: number | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private streams = new Map<number, StreamHandler>();
  private activeStream: number | null = null;
  private cache = new Map<string, Blob>();
  private el: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private queue: Blob[] = [];
  private playing = false;
  /** Bumped by stop(); in-flight async work compares against it and drops out. */
  private session = 0;
  /**
   * Generation is expensive (seconds on wasm), so while one clip is being
   * generated, further speak() calls collapse into just the latest one instead
   * of queueing a backlog in the worker.
   */
  private generating = false;
  private nextRequest: NextRequest | null = null;

  /** Start loading the model in the background (call when speech is enabled). */
  preload() {
    this.ensureWorker();
  }

  /** Observable state used by the UI to explain first-load and synthesis delays. */
  getStatus = () => this.status;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Switch the Kokoro voice; applies to the next speak/readAloud call. */
  setVoice(voice: VoiceId) {
    this.voice = voice;
  }

  /** Text longer than this is streamed sentence-by-sentence instead. */
  private static readonly STREAM_THRESHOLD = 80;

  /** Speak a word or sentence as a single clip; long text streams as a story. */
  speak(text: string, opts: SpeechOptions = {}) {
    if (typeof window === "undefined" || !text.trim()) return;
    text = speakable(text);
    if (text.length > SpeechManager.STREAM_THRESHOLD) {
      this.readAloud(text, opts);
      return;
    }
    this.stop();
    const speed = opts.speed ?? 1;
    const key = `${this.voice}|${speed}|${text}`;
    const cached = this.cache.get(key);
    if (cached) {
      this.enqueue(cached);
      return;
    }
    if (!this.ensureWorker() || !this.ready) {
      this.speakFallback(text);
      return;
    }
    if (this.generating) {
      this.nextRequest?.onPreparingChange?.(false);
      opts.onPreparingChange?.(true);
      this.nextRequest = { text, speed, onPreparingChange: opts.onPreparingChange };
      return;
    }
    this.generating = true;
    opts.onPreparingChange?.(true);
    const session = this.session;
    const id = this.nextId++;
    this.preparingId = id;
    this.setStatus("generating");
    new Promise<ArrayBuffer>((resolve, reject) => this.pending.set(id, { resolve, reject }))
      .then((wav) => {
        const blob = new Blob([wav], { type: "audio/wav" });
        if (text.length <= CACHEABLE_CHARS) this.remember(key, blob);
        if (this.session === session) this.enqueue(blob);
      })
      .catch(() => {
        if (this.session === session) this.speakFallback(text);
      })
      .finally(() => {
        opts.onPreparingChange?.(false);
        this.generating = false;
        const next = this.nextRequest;
        this.nextRequest = null;
        if (next) {
          this.speak(next.text, {
            speed: next.speed,
            onPreparingChange: next.onPreparingChange,
          });
        }
      });
    this.send({ type: "generate", id, text, voice: this.voice, speed });
  }

  /**
   * Read long text (a story) aloud, streaming sentence-by-sentence so playback
   * starts as soon as the first sentence is ready.
   */
  readAloud(text: string, opts: SpeechOptions = {}) {
    if (typeof window === "undefined" || !text.trim()) return;
    text = speakable(text);
    this.stop();
    if (!this.ensureWorker() || !this.ready) {
      this.speakFallback(text);
      return;
    }
    const session = this.session;
    const id = this.nextId++;
    this.activeStream = id;
    this.preparingId = id;
    this.setStatus("generating");
    let preparing = true;
    const finishPreparing = () => {
      if (!preparing) return;
      preparing = false;
      opts.onPreparingChange?.(false);
    };
    opts.onPreparingChange?.(true);
    this.streams.set(id, {
      onChunk: (blob) => {
        finishPreparing();
        if (this.session === session) this.enqueue(blob);
      },
      onDone: () => {
        finishPreparing();
        if (this.activeStream === id) this.activeStream = null;
      },
    });
    this.send({ type: "stream", id, text, voice: this.voice, speed: opts.speed ?? 1 });
  }

  /** Stop all playback and pending speech immediately. */
  stop() {
    if (typeof window === "undefined") return;
    this.session++;
    this.nextRequest?.onPreparingChange?.(false);
    this.nextRequest = null;
    if (this.activeStream !== null) {
      if (this.preparingId === this.activeStream) {
        this.preparingId = null;
        if (this.ready) this.setStatus("ready");
      }
      this.send({ type: "cancel", id: this.activeStream });
      this.streams.get(this.activeStream)?.onDone();
      this.streams.delete(this.activeStream);
      this.activeStream = null;
    }
    this.queue = [];
    this.playing = false;
    if (this.el) this.el.pause();
    if (this.currentUrl) {
      URL.revokeObjectURL(this.currentUrl);
      this.currentUrl = null;
    }
    window.speechSynthesis?.cancel();
  }

  /* ---------- worker plumbing ---------- */

  private ensureWorker(): Worker | null {
    if (typeof window === "undefined" || this.failed) return null;
    if (this.worker) return this.worker;
    try {
      this.worker = new Worker(new URL("./tts.worker.ts", import.meta.url), { type: "module" });
    } catch {
      this.failed = true;
      this.setStatus("failed");
      return null;
    }
    this.setStatus("loading");
    this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => this.handleMessage(e.data);
    this.worker.onerror = () => this.fail();
    this.send({ type: "init" });
    return this.worker;
  }

  private send(msg: WorkerRequest) {
    this.worker?.postMessage(msg);
  }

  private handleMessage(msg: WorkerResponse) {
    switch (msg.type) {
      case "ready":
        this.ready = true;
        this.setStatus("ready");
        break;
      case "audio": {
        this.finishPreparing(msg.id);
        this.pending.get(msg.id)?.resolve(msg.wav);
        this.pending.delete(msg.id);
        break;
      }
      case "chunk":
        this.finishPreparing(msg.id);
        this.streams.get(msg.id)?.onChunk(new Blob([msg.wav], { type: "audio/wav" }));
        break;
      case "done": {
        this.finishPreparing(msg.id);
        this.streams.get(msg.id)?.onDone();
        this.streams.delete(msg.id);
        break;
      }
      case "error": {
        if (msg.id === undefined) {
          // Model failed to load — give up on Kokoro for this session.
          this.fail();
        } else {
          this.finishPreparing(msg.id);
          this.pending.get(msg.id)?.reject(new Error(msg.message));
          this.pending.delete(msg.id);
          this.streams.get(msg.id)?.onDone();
          this.streams.delete(msg.id);
        }
        break;
      }
    }
  }

  private fail() {
    this.failed = true;
    this.ready = false;
    this.preparingId = null;
    this.setStatus("failed");
    for (const p of this.pending.values()) p.reject(new Error("TTS worker failed"));
    this.pending.clear();
    for (const s of this.streams.values()) s.onDone();
    this.streams.clear();
    this.worker?.terminate();
    this.worker = null;
  }

  private finishPreparing(id: number) {
    if (this.preparingId !== id) return;
    this.preparingId = null;
    if (this.ready) this.setStatus("ready");
  }

  private setStatus(status: SpeechStatus) {
    if (this.status === status) return;
    this.status = status;
    for (const listener of this.listeners) listener();
  }

  /* ---------- playback ---------- */

  private enqueue(blob: Blob) {
    this.queue.push(blob);
    if (!this.playing) this.playNext();
  }

  private playNext() {
    const blob = this.queue.shift();
    if (!blob) {
      this.playing = false;
      return;
    }
    this.playing = true;
    const el = (this.el ??= new Audio());
    const url = URL.createObjectURL(blob);
    this.currentUrl = url;
    const next = () => {
      if (this.currentUrl === url) this.currentUrl = null;
      URL.revokeObjectURL(url);
      this.playNext();
    };
    el.onended = next;
    el.onerror = next;
    el.src = url;
    el.play().catch(next);
  }

  private remember(key: string, blob: Blob) {
    this.cache.delete(key);
    this.cache.set(key, blob);
    if (this.cache.size > CACHE_MAX) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
  }

  private speakFallback(text: string) {
    if (!window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    } catch {
      /* speech is best-effort */
    }
  }
}

/** App-wide speech singleton. */
export const speech = new SpeechManager();
