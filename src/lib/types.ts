/** Core content + progress types for the Learning Universe. */

/* ---------- Activities ---------- */

export type ChoiceStyle =
  | "img"
  | "text"
  | "letter"
  | "glyph"
  | "char"
  | "number"
  | "color"
  | "clock"
  | "coin"
  | "set"
  | "ordinal"
  | "length"
  | "shape";

/** Flat 2D shapes drawn as SVG (for side/corner questions where 3D art misleads). */
export type Shape2D = "triangle" | "square" | "circle";

export interface Choice {
  /** Text shown on the tile (text/letter/glyph/char/number styles); row label (length style). */
  label?: string;
  /** Image tile (img/ordinal styles). */
  img?: string;
  /** Swatch tile (color style) or bar colour (length style). */
  color?: string;
  /** Clock-face tile (clock style): [hour, minute]. */
  time?: [number, number];
  /** Coin tile (coin style): value in cents. */
  cents?: number;
  /** Object-set tile (set style): number of objects; 0 shows an empty box. */
  n?: number;
  /** 1-based position chip under an ordinal tile. */
  pos?: number;
  /** Bar length in px (length style). */
  len?: number;
  /** How a length choice is drawn: a plain bar (default) or a cartoon pencil. */
  look?: "bar" | "pencil";
  /** Flat 2D shape tile (shape style). */
  shape?: Shape2D;
  correct: boolean;
}

export type Stimulus =
  | { kind: "count"; n: number }
  | { kind: "add"; a: number; b: number }
  | { kind: "subtract"; start: number; takeAway: number }
  | { kind: "objects"; img: string; n: number }
  | { kind: "shapes"; shape: Shape2D; n: number }
  | { kind: "clock"; h: number; m: number }
  | { kind: "coins"; coins: number[] }
  | { kind: "ruler"; n: number }
  | { kind: "bars"; items: { label: string; len: number }[] };

export interface ChoiceActivity {
  kind: "choice";
  style: ChoiceStyle;
  prompt: string;
  choices: Choice[];
  /** Feedback that explains the concept when answered correctly. */
  correctFeedback: string;
  /** Gentle hint shown on a wrong answer. */
  incorrectFeedback: string;
  /** Word spoken/shown by the tap-to-hear button (audio-led activities). */
  audioWord?: string;
  /** Image repeated inside each tile of a set-style activity. */
  setImg?: string;
  /** Visual objects shown above the choices (counting / addition). */
  stimulus?: Stimulus;
  /** Prediction-style activity: the outcome is revealed after choosing. */
  reveal?: boolean;
}

export interface ListenActivity {
  kind: "listen";
  word: string;
  img: string;
}

export interface BuildWordActivity {
  kind: "build-word";
  word: string;
  img: string;
}

export type Activity = ChoiceActivity | ListenActivity | BuildWordActivity;

/**
 * One question slot in a lesson: interchangeable variations of the same
 * question (e.g. 45 − 12 and 43 − 13). The player rotates through them on
 * each replay and lets the learner switch manually.
 */
export type ActivitySlot = Activity[];

/* ---------- Content ---------- */

export interface Subject {
  id: string;
  name: string;
  /** Environment name, e.g. "Word Lagoon". */
  environment?: string;
  order: number;
  accent: string;
  bg: string;
  chip: string;
  verbs: string;
  dragonLine: string;
  /** Five badge-driven rank names, from starting rank to world mastery. */
  ranks: [string, string, string, string, string];
  art: {
    plaque: string;
    badge: string;
    card: string;
  };
}

export interface Badge {
  /** Globally unique: `${subjectId}:${slug}`. */
  id: string;
  /** URL-friendly, unique within the subject. */
  slug: string;
  subjectId: string;
  order: number;
  name: string;
  skills: string[];
}

export interface Lesson {
  /** Globally unique: `${badgeId}:${n}`. */
  id: string;
  badgeId: string;
  subjectId: string;
  order: number;
  title: string;
  /** Single learning objective for the lesson. */
  objective: string;
  /** Question slots in play order; each slot holds 1+ variations. */
  activities: ActivitySlot[];
}

/** Everything one subject contributes to the universe. */
export interface SubjectContent {
  subject: Subject;
  badges: Badge[];
  lessons: Lesson[];
}

/* ---------- Stories ---------- */

export interface StoryPage {
  /** The sentence the child reads on this page. */
  text: string;
  /** Scene description — appended to STORY_ART_STYLE to form the image prompt. */
  img: string;
}

export interface StoryChoice {
  /** Scene description for the answer tile's image prompt. */
  img: string;
  correct: boolean;
}

export interface StoryQuestion {
  q: string;
  choices: StoryChoice[];
}

export interface Story {
  /** URL-friendly, unique across stories. */
  id: string;
  title: string;
  accent: string;
  tint: string;
  /** Scene description for the book cover's image prompt. */
  cover: string;
  pages: StoryPage[];
  questions: StoryQuestion[];
}

/** A user-uploaded illustration for one story image slot. */
export interface StoryImage {
  /** Slot id, e.g. `story-pat-cover`, `story-pat-p0`, `story-pat-q0-c1`. */
  id: string;
  blob: Blob;
}

/** Marks a story question that has already paid out its stars. */
export interface StoryCreditEntry {
  /** `${storyId}:q${questionIndex}` */
  key: string;
}

/** Marks a question variation the learner has answered correctly. */
export interface VariantCreditEntry {
  /** `${lessonId}:${slotIndex}:${variantIndex}` */
  key: string;
}

/* ---------- Learner state ---------- */

export interface Settings {
  speech: boolean;
  sfx: boolean;
  autoplay: boolean;
  /** Kokoro voice for read-aloud; absent on older profiles (falls back to the default voice). */
  voice?: import("./tts/protocol").VoiceId;
}

export interface Profile {
  id: string; // singleton: "default"
  child: string;
  /** False until the first-run onboarding has captured the child's name. */
  onboarded: boolean;
  mascot: string;
  stars: number;
  gems: number;
  leaves: number;
  level: number;
  settings: Settings;
}

export interface LessonProgress {
  lessonId: string;
  badgeId: string;
  subjectId: string;
  timesCompleted: number;
  completedAt: number;
}

export interface MetaEntry {
  key: string;
  value: string | number;
}

/* ---------- Derived UI state ---------- */

export type BadgeState = "not-started" | "in-progress" | "earned";

export interface BadgeStatus {
  badge: Badge;
  lessons: Lesson[];
  completedLessonIds: string[];
  state: BadgeState;
  recommended: boolean;
}
