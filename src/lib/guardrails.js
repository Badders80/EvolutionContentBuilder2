// Patterns to ban in component files. These enforce the use of token helpers.
// Banned: padding (p-x, py-x, px-x), margins (m-x, my-x), gap (gap-x), width (w-x), max-width (max-w-x).
// We keep 'w-full' for utility components but ban specific numeric values.
export const FORBIDDEN_LAYOUT_PATTERNS = [
  /p-\d/, /m-\d/,
  /py-\d/, /my-\d/,
  /px-\d/, /mx-\d/,
  /gap-\d/,
  /max-w-[a-z0-9]/,
];

export function hasForbiddenLayoutTokens(classString) {
  if (typeof classString !== 'string') return false;
  for (const pattern of FORBIDDEN_LAYOUT_PATTERNS) {
    if (pattern.test(classString)) {
      return true;
    }
  }
  return false;
}
