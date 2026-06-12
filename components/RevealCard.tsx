"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Location, RoundScore } from "@/lib/types";
import { StarRating } from "./StarRating";
import { formatKm, getCheer } from "@/lib/game";

/* Rolls the distance up from 0 like a score meter, so the number
   lands with a little drama instead of just appearing. */
function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || target < 0.5) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

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
  const animatedKm = useCountUp(score.km);

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
          {score.km < 0.5 ? "Bullseye!" : formatKm(animatedKm) + " away"}
        </span>
        <p className="pm-reveal__cheer">
          {score.km < 0.5 ? "Perfect pin! Are you secretly a kārearea? 🦅" : getCheer(score.stars)}
        </p>
      </div>

      <div className="pm-stage" style={stage(1)}>
        <h2 className="pm-reveal__name">{location.name}</h2>
        {/* Only show the te reo subtitle when it adds something the
           title doesn't already say (e.g. "Milford Sound / Piopiotahi"
           should not repeat "Piopiotahi" underneath). */}
        {location.teReo && !location.name.includes(location.teReo) && (
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
