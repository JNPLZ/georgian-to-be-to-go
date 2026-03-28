/** Returns a random integer in [0, max). */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/** Returns a random item from an array. */
export function randomItem<T>(arr: readonly T[]): T {
  return arr[randomInt(arr.length)];
}

/** Shuffles an array in-place using Fisher-Yates. */
export function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
