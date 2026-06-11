"use client";

import { useState, type CSSProperties } from "react";
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

/* Each block appears one step after the last, walking the
   student down the card: stars, place name, then each fact box. */
function stage(n: number): CSSProperties {
  return { "--stage": n } as CSSProperties;
}

export function RevealCard({ location, score, isLastRound, onNext, onBonusAnswer }: RevealCardProps) {
  const [bonusAnswer, setBonusAnswer] = useState<number | null>(null);
  const bonusAnswered = bonusAnswer !== null;

  // The fact text sometimes starts with "Did you know?" which the
  // box label already says, so trim it to avoid saying it twice.
  const factText = location.fact.replace(/^did you know\??\s*/i, "");

  function handleBonus(idx: number) {
    if (bonusAnswered) return;
    setBonusAnswer(idx);
    onBonusAnswer(idx === location.bonus.correct);
  }

  return (
    <div className="pm-reveal">
      <div className="pm-reveal__score pm-stage" style={stage(0)}>
        <StarRating stars={score.stars} size="lg" />
        <span className="pm-reveal__dist">
          {score.km < 0.5 ? "Bullseye!" : formatKm(score.km) + " away"}
        </span>
      </div>

      <div className="pm-stage" style={stage(1)}>
        <h2 className="pm-reveal__name">{location.name}</h2>
        {location.teReo && location.teReo !== location.name.split("/")[0].trim() && (
          <p className="pm-reveal__tereo">{location.teReo}</p>
        )}
      </div>

      <div className="pm-fact-box pm-fact-box--about pm-stage" style={stage(2)}>
        <span className="pm-fact-box__label">📖 About this place</span>
        <p>{location.desc}</p>
      </div>

      <div className="pm-fact-box pm-fact-box--why pm-stage" style={stage(3)}>
        <span className="pm-fact-box__label">🌋 Why is it here?</span>
        <p>{location.why}</p>
      </div>

      <div className="pm-fact-box pm-fact-box--fact pm-stage" style={stage(4)}>
        <span className="pm-fact-box__label">💡 Did you know?</span>
        <p>{factText}</p>
      </div>

      <div className="pm-fact-box pm-fact-box--quiz pm-stage" style={stage(5)}>
        <span className="pm-fact-box__label">⭐ Bonus question</span>
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

      <button
        className="pm-btn pm-btn--primary pm-reveal__next pm-stage"
        style={stage(6)}
        onClick={onNext}
        type="button"
      >
        {isLastRound ? "See Results" : "Next Location"}
      </button>
    </div>
  );
}
