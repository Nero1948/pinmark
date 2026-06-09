"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { Location, Pack, RoundScore, GamePhase } from "@/lib/types";
import { haversineKm, calcStars, totalStars, bonusCount, getResultMessage } from "@/lib/game";
import { GuessMap } from "./GuessMap";
import { StarRating } from "./StarRating";
import { RevealCard } from "./RevealCard";

type Coords = { lat: number; lng: number };

type PinmarkGameProps = {
  pack: Pack;
  locations: Location[];
};

export function PinmarkGame({ pack, locations }: PinmarkGameProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [guess, setGuess] = useState<Coords | null>(null);
  const [scores, setScores] = useState<RoundScore[]>([]);
  const confettiFiredRef = useRef(false);

  const currentLocation = locations[roundIndex];
  const currentScore = scores[roundIndex];
  const isLastRound = roundIndex === locations.length - 1;

  useEffect(() => {
    confettiFiredRef.current = false;
  }, [roundIndex]);

  useEffect(() => {
    if (phase !== "results") return;
    const stars = totalStars(scores);
    const max = locations.length * 3;
    if (stars / max >= 0.5) {
      fireConfetti(stars / max);
    }
  }, [phase, scores, locations.length]);

  async function fireConfetti(ratio: number) {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    const confetti = (await import("canvas-confetti")).default;
    const colours = ["#f5d66b", "#d6603c", "#173c36", "#136f63", "#fffdf7"];
    const count = ratio >= 0.9 ? 300 : 150;
    confetti({ particleCount: count, spread: 80, origin: { y: 0.55 }, colors: colours });
  }

  async function fireRoundConfetti(stars: number) {
    if (stars < 3) return;
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f5d66b", "#d6603c", "#173c36"]
    });
  }

  function handleSubmit() {
    if (!guess) return;
    const loc = currentLocation;
    const km = haversineKm(guess.lat, guess.lng, loc.lat, loc.lng);
    const stars = calcStars(km);
    const newScore: RoundScore = { locationId: loc.id, km, stars, bonusCorrect: null };
    const newScores = [...scores, newScore];
    setScores(newScores);
    setPhase("revealed");
    fireRoundConfetti(stars);
  }

  function handleBonusAnswer(correct: boolean) {
    setScores((prev) => {
      const updated = [...prev];
      updated[roundIndex] = { ...updated[roundIndex], bonusCorrect: correct };
      return updated;
    });
  }

  function handleNext() {
    if (isLastRound) {
      setPhase("results");
    } else {
      setRoundIndex((i) => i + 1);
      setGuess(null);
      setPhase("playing");
    }
  }

  function handleRestart() {
    setRoundIndex(0);
    setPhase("playing");
    setGuess(null);
    setScores([]);
    confettiFiredRef.current = false;
  }

  const handleGuessChange = useCallback((g: Coords) => setGuess(g), []);

  if (phase === "results") {
    const stars = totalStars(scores);
    const max = locations.length * 3;
    const bonus = bonusCount(scores);
    return (
      <div className="pm-results">
        <h1 className="pm-results__title">Results: {pack.title}</h1>
        <div className="pm-results__total">
          <StarRating stars={Math.min(3, Math.round((stars / max) * 3)) as 0 | 1 | 2 | 3} size="lg" />
          <p className="pm-results__score">{stars} / {max} stars</p>
          {bonus > 0 && (
            <p className="pm-results__bonus">+{bonus} bonus question{bonus !== 1 ? "s" : ""} correct</p>
          )}
          <p className="pm-results__message">{getResultMessage(stars, max)}</p>
        </div>
        <div className="pm-results__rounds">
          {scores.map((s, i) => {
            const loc = locations[i];
            return (
              <div key={s.locationId} className="pm-results__row">
                <span className="pm-results__loc">{loc.name}</span>
                <StarRating stars={s.stars} size="sm" />
                {s.bonusCorrect === true && <span className="pm-results__bon">+1 bonus</span>}
              </div>
            );
          })}
        </div>
        <div className="pm-results__actions">
          <button className="pm-btn pm-btn--primary" onClick={handleRestart} type="button">
            Play Again
          </button>
          <a className="pm-btn pm-btn--secondary" href="/">
            Choose Another Pack
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pm-game">
      <div className="pm-game__header">
        <a href="/" className="pm-game__back">← Packs</a>
        <span className="pm-game__progress">
          {roundIndex + 1} / {locations.length}
        </span>
        <span className="pm-game__pack">{pack.title}</span>
      </div>

      <div className="pm-game__body">
        <div className="pm-game__photo-col">
          <div className="pm-photo-wrap">
            <Image
              src={currentLocation.photo}
              alt={`Photo of ${currentLocation.name}`}
              fill
              style={{ objectFit: "cover" }}
              priority={roundIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className="pm-photo-credit">{currentLocation.credit}</p>
        </div>

        <div className="pm-game__map-col">
          {phase === "playing" ? (
            <>
              <p className="pm-map-hint">
                {guess ? "Drag your pin to adjust, then submit." : "Click on the map to place your guess."}
              </p>
              <GuessMap
                answer={null}
                disabled={false}
                guess={guess}
                onGuessChange={handleGuessChange}
                roundKey={`${pack.id}-${roundIndex}`}
                className="pm-game__map"
              />
              <button
                className="pm-btn pm-btn--primary pm-game__submit"
                onClick={handleSubmit}
                disabled={!guess}
                type="button"
              >
                Submit Guess
              </button>
            </>
          ) : (
            <>
              <GuessMap
                answer={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                disabled={true}
                guess={guess}
                onGuessChange={handleGuessChange}
                roundKey={`${pack.id}-${roundIndex}`}
                className="pm-game__map pm-game__map--revealed"
              />
              <RevealCard
                location={currentLocation}
                score={currentScore}
                isLastRound={isLastRound}
                onNext={handleNext}
                onBonusAnswer={handleBonusAnswer}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
