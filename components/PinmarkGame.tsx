"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { Location, Pack, RoundScore, GamePhase } from "@/lib/types";
import { haversineKm, calcStars, totalStars, bonusCount, getResultMessage } from "@/lib/game";
import { recordBest } from "@/lib/best";
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
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [isMapZoomed, setIsMapZoomed] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const confettiFiredRef = useRef(false);
  const bestRecordedRef = useRef(false);

  const currentLocation = locations[roundIndex];
  const currentScore = scores[roundIndex];
  const isLastRound = roundIndex === locations.length - 1;

  useEffect(() => {
    confettiFiredRef.current = false;
    setIsPhotoZoomed(false);
    setIsMapZoomed(false);
  }, [roundIndex]);

  /* On mobile the map sits below the photo, so after "Next Location"
     or "See Results" the viewport would stay stuck at the map. Scroll
     back to the top so the new photo (or the results) is what you see.
     Submitting a guess (phase "revealed") must NOT scroll, because the
     player is looking at the map to see how close they were. */
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (phase === "revealed") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [roundIndex, phase]);

  useEffect(() => {
    if (!isPhotoZoomed && !isMapZoomed) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsPhotoZoomed(false);
        setIsMapZoomed(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPhotoZoomed, isMapZoomed]);

  useEffect(() => {
    if (phase !== "results") return;
    const stars = totalStars(scores);
    const max = locations.length * 3;
    if (stars / max >= 0.5) {
      fireConfetti(stars / max);
    }
    if (!bestRecordedRef.current) {
      bestRecordedRef.current = true;
      setIsNewBest(recordBest(pack.id, stars, max));
    }
  }, [phase, scores, locations.length, pack.id]);

  async function fireConfetti(ratio: number) {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    const confetti = (await import("canvas-confetti")).default;
    const colours = ["#ffc83d", "#ff5a5f", "#2f9e63", "#5bc8eb", "#8a5cf6"];
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
      colors: ["#ffc83d", "#ff5a5f", "#2f9e63"]
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
    setIsNewBest(false);
    setShareCopied(false);
    confettiFiredRef.current = false;
    bestRecordedRef.current = false;
  }

  /* Wordle-style share text: coloured squares per round, no place
     names so it never spoils the answers for classmates. */
  function buildShareText(): string {
    const squares = scores.map((s) => ["⬜", "🟧", "🟨", "🟩"][s.stars]).join("");
    const stars = totalStars(scores);
    const bonus = bonusCount(scores);
    return [
      `📍 Pinmark · ${pack.title}`,
      `${squares} ${stars}/${locations.length * 3} ⭐${bonus > 0 ? ` (+${bonus} bonus)` : ""}`,
      `Can you beat me? ${window.location.origin}/play/${pack.id}`
    ].join("\n");
  }

  async function handleShare() {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        /* user closed the share sheet, or it's unsupported: fall
           through to the clipboard instead */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* clipboard blocked: nothing useful we can do */
    }
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
          {isNewBest && <span className="pm-results__newbest">🏆 New personal best!</span>}
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
          <button className="pm-btn pm-btn--coral" onClick={handleShare} type="button">
            {shareCopied ? "Copied! ✅" : "Share My Score"}
          </button>
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
        {/* key change re-runs the entrance animation for every new photo */}
        <div className="pm-photo-stage" key={currentLocation.id}>
          <button
            type="button"
            className="pm-photo-button"
            onClick={() => setIsPhotoZoomed(true)}
            aria-label="Tap to zoom photo"
          >
            <Image
              src={currentLocation.photo}
              alt="Mystery New Zealand location"
              width={1920}
              height={1280}
              className="pm-photo"
              priority={roundIndex === 0}
              sizes="(min-width: 920px) 64vw, 100vw"
            />
            <span className="pm-photo-zoom-hint" aria-hidden="true">
              Tap to zoom
            </span>
          </button>
          <p className="pm-photo-credit">{currentLocation.credit}</p>
        </div>

        <aside className="pm-guess-panel">
          {phase === "playing" ? (
            <>
              <p className="pm-map-hint">
                {guess
                  ? "Drag your pin to adjust, then submit! 🎯"
                  : "Where in Aotearoa is this? Tap the map! 📍"}
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
                className="pm-map-zoom-button"
                onClick={() => setIsMapZoomed(true)}
                type="button"
              >
                Open map
              </button>
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
              <div className="pm-map-legend">
                <span className="pm-map-legend__guess">Your guess</span>
                <span className="pm-map-legend__answer">Answer</span>
              </div>
              <button
                className="pm-map-zoom-button"
                onClick={() => setIsMapZoomed(true)}
                type="button"
              >
                Open map
              </button>
              <RevealCard
                location={currentLocation}
                score={currentScore}
                isLastRound={isLastRound}
                onNext={handleNext}
                onBonusAnswer={handleBonusAnswer}
              />
            </>
          )}
        </aside>
      </div>

      {isPhotoZoomed && (
        <div
          className="pm-photo-modal"
          onClick={() => setIsPhotoZoomed(false)}
          role="dialog"
          aria-label="Zoomed photo"
        >
          <button
            className="pm-modal-close"
            onClick={() => setIsPhotoZoomed(false)}
            type="button"
          >
            Close
          </button>
          <Image
            src={currentLocation.photo}
            alt="Mystery New Zealand location, zoomed"
            width={1920}
            height={1280}
            className="pm-photo-modal__img"
            sizes="96vw"
          />
        </div>
      )}

      {isMapZoomed && (
        <div className="pm-map-modal" role="dialog" aria-label="Zoomed map">
          <div className="pm-map-modal__content">
            <div className="pm-map-modal__header">
              <p className="pm-map-hint">
                {phase === "playing"
                  ? guess
                    ? "Drag your pin to adjust, then close the map to submit."
                    : "Tap anywhere in New Zealand to drop your pin."
                  : "Your guess and the answer."}
              </p>
              <button
                className="pm-modal-close pm-modal-close--static"
                onClick={() => setIsMapZoomed(false)}
                type="button"
              >
                Done
              </button>
            </div>
            <GuessMap
              answer={
                phase === "playing"
                  ? null
                  : { lat: currentLocation.lat, lng: currentLocation.lng }
              }
              disabled={phase !== "playing"}
              guess={guess}
              onGuessChange={handleGuessChange}
              roundKey={`${pack.id}-${roundIndex}-zoomed`}
              className="pm-game__map pm-game__map--zoomed"
            />
          </div>
        </div>
      )}
    </div>
  );
}
