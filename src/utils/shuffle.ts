/**
 * Helper utilities for pedagogical randomness:
 * - Fisher-Yates shuffle
 * - Random sample selection
 * - Shuffling exercise options while preserving correct answer value
 */

export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Shuffles an array of options and ensures no repetitive bias.
 */
export function shuffleOptions(options: readonly string[]): string[] {
  if (!options || options.length <= 1) return [...(options || [])];
  return shuffleArray(options);
}

/**
 * Selects count unique items from an array in randomized order.
 */
export function sampleRandom<T>(array: readonly T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
