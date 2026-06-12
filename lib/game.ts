import type { Location, Pack, RoundScore } from "./types";
import packsData from "@/data/packs.json";
import locationsData from "@/data/locations.json";

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* Kid-friendly bands: 3 stars still means "you really know where this
   is", but forgives fingertip precision on a tablet-sized map. */
export function calcStars(km: number): 0 | 1 | 2 | 3 {
  if (km <= 50) return 3;
  if (km <= 150) return 2;
  if (km <= 300) return 1;
  return 0;
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${Math.round(km)} km`;
}

export function getAllPacks(): Pack[] {
  return packsData as Pack[];
}

export function getAllLocations(): Location[] {
  return locationsData as Location[];
}

export function getPack(id: string): Pack | undefined {
  return getAllPacks().find((p) => p.id === id);
}

export function getLocationsForPack(pack: Pack): Location[] {
  const all = getAllLocations();
  return pack.locationIds
    .map((id) => all.find((l) => l.id === id))
    .filter((l): l is Location => l !== undefined);
}

export function totalStars(scores: RoundScore[]): number {
  return scores.reduce((sum, s) => sum + s.stars, 0);
}

export function bonusCount(scores: RoundScore[]): number {
  return scores.filter((s) => s.bonusCorrect === true).length;
}

/* Per-round encouragement: a bad guess should feel like a near miss,
   not a failure. Shown under the stars on the reveal card. */
export function getCheer(stars: 0 | 1 | 2 | 3): string {
  switch (stars) {
    case 3:
      return "Tino pai! You really know this place! 🎯";
    case 2:
      return "Ka pai! So close!";
    case 1:
      return "Good thinking! You were in the right part of Aotearoa.";
    default:
      return "Tricky one! Now you'll know it for next time 💪";
  }
}

export function getResultMessage(stars: number, maxStars: number): string {
  const ratio = stars / maxStars;
  if (ratio >= 0.9) return "Tino pai rawa atu! Outstanding explorer!";
  if (ratio >= 0.75) return "Ka pai! You really know Aotearoa!";
  if (ratio >= 0.5) return "Kia kaha! Keep exploring Aotearoa!";
  if (ratio >= 0.25) return "Āe, good effort! Try again to learn more.";
  return "Nō reira, keep discovering Aotearoa!";
}
