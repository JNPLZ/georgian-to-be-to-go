/** Returns a random integer in [0, max). */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/** Returns a random item from an array. */
export function randomItem<T>(arr: readonly T[]): T {
  return arr[randomInt(arr.length)];
}
