// src/components/Game.tsx
import React, { useEffect, useMemo, useState } from "react";
import { levels } from "../levels";
import Grid from "./Grid";
import type { CellHighlight, GamePhase } from "./Grid";

type ResultState = {
  correct: Set<number>;
  wrong: Set<number>;
  missed: Set<number>;
  isPerfect: boolean;
};

const OBSERVATION_TIME = 10; // seconds to watch flashing

const Game: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0); // 0-based for levels array
  const [phase, setPhase] = useState<GamePhase>("showing");
  const [timeLeft, setTimeLeft] = useState(OBSERVATION_TIME);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<ResultState | null>(null);
  const [attempts, setAttempts] = useState(0);

  const currentLevel = levels[levelIndex];

  // Compute target cells for this level
  const targetSet = useMemo(() => {
    return new Set(currentLevel.getTargets());
  }, [currentLevel]);

  // Handle observation countdown
  useEffect(() => {
    if (phase !== "showing") return;

    setTimeLeft(OBSERVATION_TIME);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("answering");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, levelIndex]);

  // Reset state when level changes
  useEffect(() => {
    setPhase("showing");
    setSelected(new Set());
    setResult(null);
    setAttempts(0);
  }, [levelIndex]);

  const handleToggleCell = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (phase !== "answering") return;
    setAttempts((prev) => prev + 1);

    const correct: number[] = [];
    const wrong: number[] = [];
    const missed: number[] = [];

    // correct picks & wrong picks
    selected.forEach((idx) => {
      if (targetSet.has(idx)) {
        correct.push(idx);
      } else {
        wrong.push(idx);
      }
    });

    // missed targets
    targetSet.forEach((idx) => {
      if (!selected.has(idx)) {
        missed.push(idx);
      }
    });

    const res: ResultState = {
      correct: new Set(correct),
      wrong: new Set(wrong),
      missed: new Set(missed),
      isPerfect: wrong.length === 0 && missed.length === 0,
    };

    setResult(res);
    setPhase("result");

    if (res.isPerfect) {
      // Simple scoring: more leftover observation time + fewer attempts = more points
      const bonus = Math.max(0, timeLeft);
      const attemptPenalty = Math.max(0, 3 - attempts); // First try gives more
      const gained = 10 + bonus + attemptPenalty * 5;
      setScore((prev) => prev + gained);
    }
  };

  const handleTryAgain = () => {
    setPhase("answering");
    setSelected(new Set());
    setResult(null);
  };

  const handleNextLevel = () => {
    if (levelIndex < levels.length - 1) {
      setLevelIndex((prev) => prev + 1);
    } else {
      // Restart from level 1 at the end
      setLevelIndex(0);
    }
  };

  const handleResetGame = () => {
    setLevelIndex(0);
    setScore(0);
    setPhase("showing");
    setSelected(new Set());
    setResult(null);
    setAttempts(0);
  };

  // Build highlight map for result phase
  const highlightMap = useMemo(() => {
    const map = new Map<number, CellHighlight>();
    if (!result) return map;

    result.correct.forEach((idx) => map.set(idx, "correct"));
    result.wrong.forEach((idx) => map.set(idx, "wrong"));
    result.missed.forEach((idx) => map.set(idx, "missed"));

    return map;
  }, [result]);

  const progressPercent = ((levelIndex + 1) / levels.length) * 100;

  return (
    <section className="game">
      <div className="game__top">
        <div className="game__info">
          <h2>
            Level {currentLevel.id}: {currentLevel.name}
          </h2>
          <p className="game__subtitle">
            Watch the flashing squares, then select which ones were flashing. ✨
          </p>
        </div>
        <div className="game__stats">
          <div className="game__stat">
            <span className="game__stat-label">Score</span>
            <span className="game__stat-value">{score}</span>
          </div>
          <div className="game__stat">
            <span className="game__stat-label">Level</span>
            <span className="game__stat-value">
              {levelIndex + 1}/{levels.length}
            </span>
          </div>
          <div className="game__progress">
            <div className="game__progress-bar">
              <div
                className="game__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timer / Phase info */}
      <div className="game__phase">
        {phase === "showing" && (
          <p>
            👀 Memorize the pattern… Time left:{" "}
            <span className="badge badge--timer">{timeLeft}s</span>
          </p>
        )}
        {phase === "answering" && (
          <p>
            🔍 Now select the squares you think were flashing. Click to toggle.
          </p>
        )}
        {phase === "result" && result && (
          <p>
            {result.isPerfect ? "🎉 Perfect! You cracked the pattern." : "❌ Not quite. Check the feedback and try again!"}
          </p>
        )}
      </div>

      {/* The main grid */}
      <Grid
        phase={phase}
        selected={selected}
        targets={targetSet}
        highlights={highlightMap}
        onToggleCell={handleToggleCell}
      />

      {/* Controls */}
      <div className="game__controls">
        {phase === "answering" && (
          <button className="btn btn--primary" onClick={handleSubmit}>
            Submit Answer ✅
          </button>
        )}

        {phase === "result" && result && (
          <div className="game__result-actions">
            {!result.isPerfect && (
              <>
                <p className="game__hint">
                  <strong>Hint:</strong> {currentLevel.hint}
                </p>
                <button className="btn" onClick={handleTryAgain}>
                  Try this Level Again 🔁
                </button>
              </>
            )}

            {result.isPerfect && (
              <button className="btn btn--primary" onClick={handleNextLevel}>
                {levelIndex === levels.length - 1 ? "Restart from Level 1 🔄" : "Next Level ⏭"}
              </button>
            )}
          </div>
        )}

        <button className="btn btn--ghost" onClick={handleResetGame}>
          Reset Game ♻️
        </button>
      </div>

      {/* Optional: Show rule description after result */}
      {phase === "result" && (
        <div className="game__rule">
          <p>
            <strong>Level Rule Revealed:</strong> {currentLevel.description}
          </p>
        </div>
      )}
    </section>
  );
};

export default Game;
