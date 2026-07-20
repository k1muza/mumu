# Learning Universe

A multi-subject learning universe for early learners, built with **Next.js (App Router)**, **Tailwind CSS**, and **Dexie.js** (IndexedDB). Aki the dragon accompanies the child through English, Maths, Science, Shona, Mandarin, and Social Sciences worlds.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
Learning Universe (/)            → all subject worlds, all unlocked
  Subject World (/world/[id])    → badges grouping lessons
    Lesson (/lesson/[id]/[badge])→ 4–7 short interactions + immediate feedback
Rewards (/rewards)               → stars, gems, world medals, achievements
Grown-ups (/parent)              → progress dashboard + settings, behind a maths gate
```

## How content works

All content lives in **Dexie (IndexedDB)** and is seeded from typed files in `src/content/`:

- `src/content/<subject>.ts` — one file per subject world: its theme (colours, art, dragon line) plus badges and lessons, written with the terse builders in `src/content/builders.ts` (`pic`, `txt`, `countObjects`, `predict`, `listen`, `buildWord`, …).
- `src/content/index.ts` — registers subjects and holds `CONTENT_VERSION`.

On app start, `src/lib/db.ts` compares the stored content version with `CONTENT_VERSION` and re-seeds the content tables when it changed. **Learner progress and profile are never touched by re-seeding.**

### Add a lesson or badge

1. Edit the subject's file in `src/content/` (badges take a list of lessons; each lesson has one objective and a list of activities).
2. Bump `CONTENT_VERSION` in `src/content/index.ts`.

### Add a subject world

1. Create `src/content/<subject>.ts` exporting a `SubjectContent` (copy an existing one).
2. Add world art under `public/universe/` and reference it in the subject's `art` block.
3. Register it in `ALL_CONTENT` in `src/content/index.ts` and bump `CONTENT_VERSION`.

### Add an activity type

1. Add the shape to the `Activity` union in `src/lib/types.ts`.
2. Create a stage component in `src/components/lesson/` implementing `StageProps`.
3. Register it in the `STAGES` map in `src/components/lesson/LessonPlayer.tsx`.
4. (Optional) add a builder in `src/content/builders.ts` for terse authoring.

## Data model

| Table      | Contents                                             |
| ---------- | ---------------------------------------------------- |
| `subjects` | Subject worlds (theme, art, dragon line)             |
| `badges`   | Badges grouping lessons, ordered per subject         |
| `lessons`  | Lessons with embedded activities                     |
| `profiles` | Child profile, stars/gems/level, settings            |
| `progress` | Per-lesson completion (drives badge/world state)     |
| `meta`     | Seeded content version                               |

Badges are **earned** when every lesson in the badge is complete. One star is awarded the first time each question version is answered correctly, so a different version can earn another star; lesson completion and practice do not add extra stars. A gem is awarded for each badge earned, and the level rises every 25 stars. Each world also has five badge-driven named ranks, while the universe rank is derived from total badges across all worlds. The recommended "continue here" badge is the first unearned badge in each world — nothing is ever locked.
