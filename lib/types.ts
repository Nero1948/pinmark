export type Island = "North" | "South";

export type BonusQuestion = {
  q: string;
  opts: [string, string, string];
  correct: 0 | 1 | 2;
};

export type LocationSources = {
  wikipedia: string;
  government: string;
};

export type Location = {
  id: string;
  name: string;
  teReo: string;
  region: string;
  island: Island;
  lat: number;
  lng: number;
  photo: string;
  credit: string;
  licence: string;
  sourceUrl: string;
  desc: string;
  why: string;
  fact: string;
  curriculum: string;
  bonus: BonusQuestion;
  sources: LocationSources;
};

export type Pack = {
  id: string;
  title: string;
  blurb: string;
  difficulty: "easy" | "medium" | "hard";
  emoji: string;
  curriculumStrand: string;
  locationIds: string[];
};

export type RoundScore = {
  locationId: string;
  km: number;
  stars: 0 | 1 | 2 | 3;
  bonusCorrect: boolean | null;
};

export type GamePhase = "playing" | "revealed" | "results";
