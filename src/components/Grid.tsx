// src/components/Grid.tsx
import React from "react";
import { GRID_DIMENSION, TOTAL_CELLS } from "../levels";

export type GamePhase = "showing" | "answering" | "result";

export type CellHighlight = "none" | "correct" | "wrong" | "missed";

type GridProps = {
  phase: GamePhase;
  selected: Set<number>;
  targets: Set<number>;
  highlights: Map<number, CellHighlight>; // used in result phase
  onToggleCell: (index: number) => void;
};

const Grid: React.FC<GridProps> = ({
  phase,
  selected,
  targets,
  highlights,
  onToggleCell,
}) => {
  const handleCellClick = (index: number) => {
    if (phase !== "answering") return;
    onToggleCell(index);
  };

  const cells = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const isSelected = selected.has(i);
    const isTarget = targets.has(i);
    const highlight = highlights.get(i) ?? "none";

    const classes = ["grid__cell"];

    if (phase === "showing" && isTarget) {
      classes.push("grid__cell--flash");
    }

    if (phase === "answering" && isSelected) {
      classes.push("grid__cell--selected");
    }

    if (phase === "result") {
      if (highlight === "correct") classes.push("grid__cell--correct");
      if (highlight === "wrong") classes.push("grid__cell--wrong");
      if (highlight === "missed") classes.push("grid__cell--missed");
    }

    cells.push(
      <button
        key={i}
        className={classes.join(" ")}
        onClick={() => handleCellClick(i)}
      >
        {/* Optional: show index for debugging / hint */}
        <span className="grid__cell-index">{i}</span>
      </button>
    );
  }

  return (
    <div
      className={`grid grid--phase-${phase}`}
      style={{
        gridTemplateColumns: `repeat(${GRID_DIMENSION}, minmax(0, 1fr))`,
      }}
    >
      {cells}
    </div>
  );
};

export default Grid;
