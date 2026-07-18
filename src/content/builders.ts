import type {
  Activity,
  ActivitySlot,
  Badge,
  BuildWordActivity,
  Choice,
  ChoiceActivity,
  ChoiceStyle,
  Lesson,
  ListenActivity,
  Shape2D,
  Stimulus,
} from "@/lib/types";

/** Asset path helpers. */
export const uni = (p: string) => `/universe/${p}`;
export const obj = (id: string) => `/assets/learning-objects/${id}.png`;
export const shape = (id: string) => `/universe/decorative/shape_${id}.png`;

const DEFAULT_HINT = "Not quite — have another try!";

interface ChoiceOptions {
  audioWord?: string;
  setImg?: string;
  stimulus?: Stimulus;
  reveal?: boolean;
  incorrectFeedback?: string;
}

function choice(
  style: ChoiceStyle,
  prompt: string,
  choices: Choice[],
  correctFeedback: string,
  opts: ChoiceOptions = {},
): ChoiceActivity {
  return {
    kind: "choice",
    style,
    prompt,
    choices,
    correctFeedback,
    incorrectFeedback: opts.incorrectFeedback ?? DEFAULT_HINT,
    audioWord: opts.audioWord,
    setImg: opts.setImg,
    stimulus: opts.stimulus,
    reveal: opts.reveal,
  };
}

const labels = (correct: string, wrongs: string[]): Choice[] => [
  { label: correct, correct: true },
  ...wrongs.map((label) => ({ label, correct: false })),
];

/** Picture choice: images are learning-object ids. */
export const pic = (
  prompt: string,
  correct: string,
  wrongs: string[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "img",
    prompt,
    [
      { img: obj(correct), correct: true },
      ...wrongs.map((w) => ({ img: obj(w), correct: false })),
    ],
    feedback,
  );

/** Picture choice driven by a spoken word (language worlds). */
export const audioPic = (
  word: string,
  prompt: string,
  correct: string,
  wrongs: string[],
  feedback: string,
): ChoiceActivity => ({ ...pic(prompt, correct, wrongs, feedback), audioWord: word });

/** Shape tiles from the decorative shape art. */
export const shapePick = (
  prompt: string,
  correct: string,
  wrongs: string[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "img",
    prompt,
    [
      { img: shape(correct), correct: true },
      ...wrongs.map((w) => ({ img: shape(w), correct: false })),
    ],
    feedback,
  );

export const letter = (p: string, c: string, w: string[], f: string) =>
  choice("letter", p, labels(c, w), f);
export const glyph = (p: string, c: string, w: string[], f: string) =>
  choice("glyph", p, labels(c, w), f);
export const hanzi = (p: string, c: string, w: string[], f: string) =>
  choice("char", p, labels(c, w), f);
export const txt = (p: string, c: string, w: string[], f: string) =>
  choice("text", p, labels(c, w), f);

export const numPick = (p: string, c: number, w: number[], f: string) =>
  choice("number", p, labels(String(c), w.map(String)), f);

/** Count the objects shown in the stimulus. */
export const countObjects = (
  n: number,
  prompt: string,
  options: number[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "number",
    prompt,
    options.map((o) => ({ label: String(o), correct: o === n })),
    feedback,
    { stimulus: { kind: "count", n } },
  );

/** Combine two object groups shown in the stimulus. */
export const addGroups = (
  a: number,
  b: number,
  prompt: string,
  options: number[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "number",
    prompt,
    options.map((o) => ({ label: String(o), correct: o === a + b })),
    feedback,
    { stimulus: { kind: "add", a, b } },
  );

/** Take one group away from another and show the removed objects crossed out. */
export const subtractGroups = (
  start: number,
  takeAway: number,
  prompt: string,
  options: number[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "number",
    prompt,
    options.map((option) => ({ label: String(option), correct: option === start - takeAway })),
    feedback,
    {
      stimulus: { kind: "subtract", start, takeAway },
      incorrectFeedback: "Count the stars that are not crossed out. You can do it!",
    },
  );

/** Count a row of pictured objects shown in the stimulus. */
export const countRow = (
  n: number,
  img: string,
  prompt: string,
  options: number[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "number",
    prompt,
    options.map((o) => ({ label: String(o), correct: o === n })),
    feedback,
    { stimulus: { kind: "objects", img, n } },
  );

/** Count a row of decorative shapes shown in the stimulus. */
export const shapeCount = (
  n: number,
  shapeId: string,
  prompt: string,
  options: number[],
  feedback: string,
): ChoiceActivity => countRow(n, shape(shapeId), prompt, options, feedback);

/** Pick the flat 2D shape the prompt describes (sides, corners, roundness). */
export const flatShapePick = (
  prompt: string,
  correct: Shape2D,
  wrongs: Shape2D[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "shape",
    prompt,
    [{ shape: correct, correct: true }, ...wrongs.map((s) => ({ shape: s, correct: false }))],
    feedback,
  );

/** Count a row of flat 2D shapes shown in the stimulus. */
export const flatShapeCount = (
  n: number,
  shapeKind: Shape2D,
  prompt: string,
  options: number[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "number",
    prompt,
    options.map((o) => ({ label: String(o), correct: o === n })),
    feedback,
    { stimulus: { kind: "shapes", shape: shapeKind, n } },
  );

/** Pick the tile whose set holds the right number of objects (0 shows an empty box). */
export const setPick = (
  prompt: string,
  correctN: number,
  wrongNs: number[],
  img: string,
  feedback: string,
): ChoiceActivity =>
  choice(
    "set",
    prompt,
    [{ n: correctN, correct: true }, ...wrongNs.map((n) => ({ n, correct: false }))],
    feedback,
    { setImg: img },
  );

/** Bare addition equation (numbers too big to picture). */
export const addNum = (a: number, b: number, options: number[], feedback: string): ChoiceActivity =>
  choice(
    "number",
    `${a} + ${b} = ?`,
    options.map((o) => ({ label: String(o), correct: o === a + b })),
    feedback,
  );

/** Bare subtraction equation (numbers too big to picture). */
export const subNum = (a: number, b: number, options: number[], feedback: string): ChoiceActivity =>
  choice(
    "number",
    `${a} − ${b} = ?`,
    options.map((o) => ({ label: String(o), correct: o === a - b })),
    feedback,
  );

/** Read the analogue clock in the stimulus and pick the matching time phrase. */
export const clockRead = (
  h: number,
  m: number,
  correct: string,
  wrongs: string[],
  feedback: string,
): ChoiceActivity =>
  choice("text", "What time does this clock show?", labels(correct, wrongs), feedback, {
    stimulus: { kind: "clock", h, m },
  });

/** Pick the clock face showing the asked-for time. Times are [hour, minute]. */
export const clockPick = (
  prompt: string,
  correct: [number, number],
  wrongs: [number, number][],
  feedback: string,
): ChoiceActivity =>
  choice(
    "clock",
    prompt,
    [{ time: correct, correct: true }, ...wrongs.map((time) => ({ time, correct: false }))],
    feedback,
  );

/** Tap the shape at the asked-for position in a fixed row (0-based correct index). */
export const ordinalPick = (
  prompt: string,
  shapeIds: string[],
  correctIdx: number,
  feedback: string,
): ChoiceActivity =>
  choice(
    "ordinal",
    prompt,
    shapeIds.map((id, i) => ({ img: shape(id), pos: i + 1, correct: i === correctIdx })),
    feedback,
  );

/** Compare stacked bars and tap the one the prompt asks for (0-based correct index). */
export const lengthPick = (
  prompt: string,
  bars: { len: number; color?: string; label?: string; look?: "bar" | "pencil" }[],
  correctIdx: number,
  feedback: string,
): ChoiceActivity =>
  choice(
    "length",
    prompt,
    bars.map((bar, i) => ({ ...bar, correct: i === correctIdx })),
    feedback,
  );

/** Measure the stimulus line with paperclip units. */
export const rulerCount = (
  n: number,
  prompt: string,
  options: number[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "number",
    prompt,
    options.map((o) => ({ label: String(o), correct: o === n })),
    feedback,
    { stimulus: { kind: "ruler", n } },
  );

/** Order the labelled bars in the stimulus by length. */
export const barsOrder = (
  prompt: string,
  items: { label: string; len: number }[],
  correct: string,
  wrongs: string[],
  feedback: string,
): ChoiceActivity =>
  choice("text", prompt, labels(correct, wrongs), feedback, {
    stimulus: { kind: "bars", items },
  });

/** Tap the coin worth the asked-for value (in cents). */
export const coinPick = (
  prompt: string,
  correctCents: number,
  wrongCents: number[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "coin",
    prompt,
    [{ cents: correctCents, correct: true }, ...wrongCents.map((cents) => ({ cents, correct: false }))],
    feedback,
  );

/** Add up the coins shown in the stimulus. */
export const coinTotal = (coins: number[], options: number[], feedback: string): ChoiceActivity => {
  const sum = coins.reduce((total, cents) => total + cents, 0);
  return choice(
    "number",
    "How many cents is this in total?",
    options.map((o) => ({ label: String(o), correct: o === sum })),
    feedback,
    { stimulus: { kind: "coins", coins } },
  );
};

export const compareNumbers = (
  prompt: string,
  big: number,
  small: number,
  feedback: string,
): ChoiceActivity =>
  choice(
    "number",
    prompt,
    [
      { label: String(big), correct: true },
      { label: String(small), correct: false },
    ],
    feedback,
  );

export const audioNum = (
  word: string,
  prompt: string,
  correct: number,
  wrongs: number[],
  feedback: string,
): ChoiceActivity => ({ ...numPick(prompt, correct, wrongs, feedback), audioWord: word });

/** Colour swatch choice driven by a spoken word. */
export const colour = (
  word: string,
  prompt: string,
  hex: string,
  wrongs: string[],
  feedback: string,
): ChoiceActivity =>
  choice(
    "color",
    prompt,
    [
      { color: hex, correct: true },
      ...wrongs.map((c) => ({ color: c, correct: false })),
    ],
    feedback,
    { audioWord: word },
  );

/** Prediction activity: reveal the outcome after choosing (science). */
export const predict = (
  prompt: string,
  correct: string,
  wrongs: string[],
  feedback: string,
): ChoiceActivity =>
  choice("text", prompt, labels(correct, wrongs), feedback, {
    reveal: true,
    incorrectFeedback: "Let’s watch and see what happens…",
  });

export const listen = (word: string): ListenActivity => ({
  kind: "listen",
  word,
  img: obj(word),
});

export const buildWord = (word: string): BuildWordActivity => ({
  kind: "build-word",
  word,
  img: obj(word),
});

/* ---------- Content assembly ---------- */

/**
 * Variations of one question that practise the same skill (e.g. 45 − 12 and
 * 43 − 13). The player rotates through them on each replay so revision isn't
 * answer recall, and offers a switcher to jump between them.
 */
export const vary = (...variants: Activity[]): ActivitySlot => variants;

export interface BadgeDef {
  slug: string;
  name: string;
  skills: string[];
  lessons: LessonDef[];
}

export interface LessonDef {
  title: string;
  objective: string;
  /** A bare Activity is a slot with a single variation; use vary() for more. */
  activities: (Activity | ActivitySlot)[];
}

/** Expand terse badge definitions into keyed Badge + Lesson rows. */
export function expandBadges(
  subjectId: string,
  defs: BadgeDef[],
): { badges: Badge[]; lessons: Lesson[] } {
  const badges: Badge[] = [];
  const lessons: Lesson[] = [];
  defs.forEach((def, i) => {
    const badgeId = `${subjectId}:${def.slug}`;
    badges.push({
      id: badgeId,
      slug: def.slug,
      subjectId,
      order: i,
      name: def.name,
      skills: def.skills,
    });
    def.lessons.forEach((l, j) => {
      lessons.push({
        id: `${badgeId}:${j}`,
        badgeId,
        subjectId,
        order: j,
        title: l.title,
        objective: l.objective,
        activities: l.activities.map((a) => (Array.isArray(a) ? a : [a])),
      });
    });
  });
  return { badges, lessons };
}
