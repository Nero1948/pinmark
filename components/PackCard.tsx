"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Pack } from "@/lib/types";
import { getBest, type PackBest } from "@/lib/best";

type PackCardProps = {
  pack: Pack;
};

export function PackCard({ pack }: PackCardProps) {
  /* Best score lives in localStorage, which only exists in the
     browser, so it's read after mount to keep hydration clean. */
  const [best, setBest] = useState<PackBest | null>(null);

  useEffect(() => {
    setBest(getBest(pack.id));
  }, [pack.id]);

  const difficultyLabel = {
    easy: "Beginner",
    medium: "Explorer",
    hard: "Expert"
  }[pack.difficulty];

  const isPerfect = best !== null && best.stars === best.max;

  return (
    <Link href={`/play/${pack.id}`} className="pm-pack-card">
      <div className="pm-pack-card__emoji">{pack.emoji}</div>
      <div className="pm-pack-card__body">
        <h2 className="pm-pack-card__title">{pack.title}</h2>
        <p className="pm-pack-card__blurb">{pack.blurb}</p>
        <div className="pm-pack-card__meta">
          <span className={`pm-badge pm-badge--${pack.difficulty}`}>{difficultyLabel}</span>
          <span className="pm-pack-card__count">{pack.locationIds.length} places</span>
          {best && (
            <span
              className={`pm-pack-card__best${isPerfect ? " pm-pack-card__best--perfect" : ""}`}
            >
              {isPerfect ? "🏆 Perfect!" : `⭐ Best: ${best.stars}/${best.max}`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
