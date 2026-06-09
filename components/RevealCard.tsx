"use client";

import { useState } from "react";
import type { Location, RoundScore } from "@/lib/types";
import { StarRating } from "./StarRating";
import { formatKm } from "@/lib/game";

type RevealCardProps = {
  location: Location;
  score: RoundScore;
  isLastRound: boolean;
  onNext: () => void;
  onBonusAnswer: (correct: boolean) => void;
};

export function RevealCard({ location, score, isLastRound, onNext, onBonusAnswer }: RevealCardProps) {
  const [bonusAnswer, setBonusAnswer] = useState<number | null>(null);
  const bonusAnswered = bonusAnswer !== null;

  function handleBonus(idx: number) {
    if (bonusAnswered) return;
    setBonusAnswer(idx);
    onBonusAnswer(idx === location.bonus.correct);
  }

  return (
    <div className="pm-reveal">
      <div className="pm-reveal__score">
        <StarRating stars={score.stars} size="lg" />
        <span className="pm-reveal__dist">
          {score.km < 0.5 ? "Bullseye!" : formatKm(score.km) + " away"}
        </span>
      </div>

      <div className="pm-reveal__info">
        <h2 className="pm-reveal__name">{location.name}</h2>
        {location.teReo && location.teReo !== location.name.split("/")[0].trim() && (
          <p className="pm-reveal__tereo">{location.teReo}</p>
        )}
        <p className="pm-reveal__desc">{location.desc}</p>

        <div className="pm-reveal__why">
          <span className="pm-label">Why is it here?</span>
          <p>{location.why}</p>
        </div>

        <div className="pm-reveal__fact">
          <span className="pm-label">Did you know?</span>
          <p>{location.fact}</p>
        </div>
      </div>

      <div className="pm-bonus">
        <p className="pm-bonus__q">{location.bonus.q}</p>
        <div className="pm-bonus__opts">
          {location.bonus.opts.map((opt, i) => {
            let cls = "pm-bonus__opt";
            if (bonusAnswered) {
              if (i === location.bonus.correct) cls += " pm-bonus__opt--correct";
              else if (i === bonusAnswer) cls += " pm-bonus__opt--wrong";
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleBonus(i)}
                disabled={bonusAnswered}
                type="button"
              >
                {opt}
              </button>
            );
          })}
        </div>
        {bonusAnswered && (
          <p className={`pm-bonus__result ${bonusAnswer === location.bonus.correct ? "pm-bonus__result--correct" : "pm-bonus__result--wrong"}`}>
            {bonusAnswer === location.bonus.correct
              ? "Ka pai! Correct!"
              : `The answer was: ${location.bonus.opts[location.bonus.correct]}`}
          </p>
        )}
      </div>

      <button className="pm-btn pm-btn--primary pm-reveal__next" onClick={onNext} type="button">
        {isLastRound ? "See Results" : "Next Location"}
      </button>
    </div>
  );
}
