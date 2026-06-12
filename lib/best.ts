export type PackBest = { stars: number; max: number };

const STORAGE_KEY = "pinmark-best-stars";

function readBests(): Record<string, PackBest> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getBest(packId: string): PackBest | null {
  return readBests()[packId] ?? null;
}

/* Stores the score if it beats the stored best for this pack.
   Returns true only when it improves on a previous play, so the
   very first completion doesn't shout "New best!". */
export function recordBest(packId: string, stars: number, max: number): boolean {
  const bests = readBests();
  const prev = bests[packId];
  if (prev && stars <= prev.stars) return false;
  bests[packId] = { stars, max };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bests));
  } catch {
    /* private browsing or full storage: the game still works */
  }
  return prev !== undefined;
}
