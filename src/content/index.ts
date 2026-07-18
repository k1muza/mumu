import type { SubjectContent } from "@/lib/types";
import english from "./english";
import maths from "./maths";
import science from "./science";
import shona from "./shona";
import mandarin from "./mandarin";

/**
 * Bump this whenever content changes (new subjects, badges, lessons, or
 * edits to existing ones). The database re-seeds content tables when the
 * stored version differs — learner progress is never touched.
 */
export const CONTENT_VERSION = 9;

/**
 * To add a new subject world: create `src/content/<subject>.ts` exporting a
 * SubjectContent, add it here, and bump CONTENT_VERSION.
 */
export const ALL_CONTENT: SubjectContent[] = [english, maths, science, shona, mandarin];
