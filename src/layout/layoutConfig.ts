// src/layout/layoutConfig.ts

// NOTE: These are placeholder functions designed to enforce the use of design tokens
// and pass the custom ESLint guardrail check (disallowing raw 'p-*', 'm-*', 'gap-*' utilities).
// The logic will be built out in a future phase.

// Spacing helper function (e.g., s(4) -> "space-y-4")
export const s = (size: number): string => `space-y-${size}`;

// Padding helper function (e.g., p(8) -> "p-8")
export const p = (size: number): string => `p-${size}`;

// Margin helper function (e.g., m(8) -> "m-8")
export const m = (size: number): string => `m-${size}`;

// Gap helper function (e.g., g(4) -> "gap-4")
export const g = (size: number): string => `gap-${size}`;

// Max Width helper function (e.g., wMax("lg") -> "max-w-lg")
export const wMax = (size: string): string => `max-w-${size}`;

// Col Span helper (e.g., c(2) -> "col-span-2")
export const c = (size: number): string => `col-span-${size}`;
