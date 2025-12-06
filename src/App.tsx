// src/App.tsx
import React from "react";
import Game from "./components/Game";
import Header from "./components/Header";
import { useTheme } from "./hooks/useTheme";

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app app--${theme}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="app__main">
        <Game />
      </main>
      <footer className="app__footer">
        <span>Pattern Decoder Puzzle • React + TypeScript</span>
      </footer>
    </div>
  );
};

export default App;
