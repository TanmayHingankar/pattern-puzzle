// src/levels.ts

export type LevelId = 1 | 2 | 3 | 4 | 5;

export type LevelConfig = {
  id: LevelId;
  name: string;
  description: string; // You can show after the user answers
  hint: string;        // Shown if they get it wrong
  getTargets: () => number[]; // Returns indices [0..24] that should flash
};

const GRID_SIZE = 5;

// Utility to convert (row, col) -> index
const idx = (row: number, col: number) => row * GRID_SIZE + col;

// Prime check helper
const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

export const levels: LevelConfig[] = [
  {
    id: 1,
    name: "Even Indices",
    description: "Squares where the 0-based index is even (index % 2 === 0).",
    hint: "Look at the numbering of squares from 0 to 24…",
    getTargets: () => {
      const arr: number[] = [];
      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        if (i % 2 === 0) arr.push(i);
      }
      return arr;
    },
  },
  {
    id: 2,
    name: "Diagonals",
    description:
      "Squares that lie on either the main diagonal or the anti-diagonal (row === col) or (row + col === 4).",
    hint: "Think of lines from corner to corner.",
    getTargets: () => {
      const arr: number[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (r === c || r + c === GRID_SIZE - 1) {
            arr.push(idx(r, c));
          }
        }
      }
      return arr;
    },
  },
  {
    id: 3,
    name: "Prime Numbers",
    description: "Squares whose indices are prime numbers.",
    hint: "The pattern is number theory related 😉",
    getTargets: () => {
      const arr: number[] = [];
      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        if (isPrime(i)) arr.push(i);
      }
      return arr;
    },
  },
  {
    id: 4,
    name: "Center Cluster",
    description: "Center cell (12) and its 4 direct neighbors.",
    hint: "Focus near the middle.",
    getTargets: () => {
      const center = idx(2, 2); // 12
      const neighbors = [idx(1, 2), idx(3, 2), idx(2, 1), idx(2, 3)]; // up, down, left, right
      return [center, ...neighbors];
    },
  },
  {
    id: 5,
    name: "Modulo Magic",
    description: "Squares where (row + col) % 3 === 0.",
    hint: "Try adding row index and column index.",
    getTargets: () => {
      const arr: number[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if ((r + c) % 3 === 0) {
            arr.push(idx(r, c));
          }
        }
      }
      return arr;
    },
  },
];

export const TOTAL_CELLS = 25;
export const GRID_DIMENSION = GRID_SIZE;
