import Link from "next/link";
import type { Pack } from "@/lib/types";

type PackCardProps = {
  pack: Pack;
};

export function PackCard({ pack }: PackCardProps) {
  const difficultyLabel = {
    easy: "Beginner",
    medium: "Explorer",
    hard: "Expert"
  }[pack.difficulty];

  return (
    <Link href={`/play/${pack.id}`} className="pm-pack-card">
      <div className="pm-pack-card__emoji">{pack.emoji}</div>
      <div className="pm-pack-card__body">
        <h2 className="pm-pack-card__title">{pack.title}</h2>
        <p className="pm-pack-card__blurb">{pack.blurb}</p>
        <div className="pm-pack-card__meta">
          <span className={`pm-badge pm-badge--${pack.difficulty}`}>{difficultyLabel}</span>
          <span className="pm-pack-card__count">{pack.locationIds.length} places</span>
        </div>
      </div>
    </Link>
  );
}
