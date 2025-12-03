// Utility to validate AI payloads for forbidden fields (CSS, Tailwind, HTML)
// Returns true if valid, false if any forbidden field/value is found

const FORBIDDEN_KEYS = [
  'className', 'style', 'css', 'html', 'dangerouslySetInnerHTML',
];
const FORBIDDEN_PATTERNS = [
  /w-\d/, /px-\d/, /py-\d/, /gap-\d/, /<div/i, /<span/i, /<style/i, /<script/i, /tailwind/i,
];

export function validateAIPayload(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return true;
  const stack = [obj];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== 'object') continue;
    for (const [key, value] of Object.entries(current)) {
      if (FORBIDDEN_KEYS.includes(key)) return false;
      // [FIX] Ensure the value is explicitly a string before using regex test
      if (typeof value === 'string') {
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (typeof value === 'string' && pattern.test(value)) return false;
        }
      } else if (typeof value === 'object' && value !== null) {
        // [FIX] Safely push objects onto the stack for deep checking
        stack.push(value);
      }
    }
  }
  return true;
}
