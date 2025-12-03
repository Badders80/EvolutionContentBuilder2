const BANNED_TERMS = [
  "bet",
  "multi",
  "sure thing",
  "get your money on",
  "revolutionary",
  "game-changing",
  "democratise",
  "democratize",
  "disrupting the industry"
  // extend with your Brand Bible banned list
];

import type { ContentDocument } from "../types/content";

export function checkContentGuardrails(doc: ContentDocument): string[] {
  const text = [
    doc.headline,
    doc.subheading ?? "",
    doc.body_intro,
    doc.body_details
  ].join(" ").toLowerCase();

  return BANNED_TERMS.filter(term => text.includes(term.toLowerCase()));
}
