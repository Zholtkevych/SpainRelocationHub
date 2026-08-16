const MIN_FILL_TIME_MS = 2_500;
const MAX_STALE_MS = 2 * 60 * 60 * 1000;

/**
 * Invisible-only spam heuristics per PRD FR-06.10 (no visible captcha).
 * Soft signals, not a hard security boundary — combine with the honeypot
 * field already rejected at the schema layer (spamFieldsSchema requires
 * `company` to be empty).
 */
export function looksLikeSpam(startedAt: number): boolean {
  const elapsed = Date.now() - startedAt;
  return elapsed < MIN_FILL_TIME_MS || elapsed > MAX_STALE_MS;
}
