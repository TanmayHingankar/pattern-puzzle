// src/components/Header.tsx
import React from "react";
import type { Theme } from "../hooks/useTheme";

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="header">
      <div className="header__title">
        <h1>Pattern Decoder</h1>
        <p>Watch. Think. Decode. 🧠</p>
      </div>
      <div className="header__controls">
        <button className="btn" onClick={onToggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
};

export default Header;
