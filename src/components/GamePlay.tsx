import React, { useRef, useEffect } from "react";
import { Word } from "../types";

interface GamePlayProps {
  currentWord: Word;
  userInput: string;
  mistakeCount: number;
  questionsRemaining: number;
  score: number;
  onInputChange: (value: string) => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  currentWord,
  userInput,
  mistakeCount,
  questionsRemaining,
  score,
  onInputChange,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自動的にテキスト入力フィールドにフォーカスする
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);

  // 文字ごとの状態を計算
  const getCharacterStates = (): Array<"correct" | "incorrect" | "neutral"> => {
    const states: Array<"correct" | "incorrect" | "neutral"> = [];

    currentWord.roman.split("").forEach((char, index) => {
      if (index >= userInput.length) {
        states.push("neutral");
      } else if (char === userInput[index]) {
        states.push("correct");
      } else {
        states.push("incorrect");
      }
    });

    return states;
  };

  const characterStates = getCharacterStates();

  return (
    <div id="game" className="card">
      <div className="timer" id="timer">
        {questionsRemaining}
      </div>
      <div className="container">
        <div className="word-display">
          <div id="wordDisplay">{currentWord.japanese}</div>
        </div>
        <div className="type-display" id="typeDisplay">
          {currentWord.roman.split("").map((char, index) => (
            <span key={index} className={characterStates[index]}>
              {char}
            </span>
          ))}
        </div>
        <textarea
          ref={inputRef}
          id="typeInput"
          className="type-input"
          value={userInput}
          onChange={e => onInputChange(e.target.value)}
          autoFocus
        />
        <div className="game-stats">
          <div id="score">スコア: {score}</div>
          <div id="mistakeCount">ミス: {mistakeCount}</div>
        </div>
      </div>
    </div>
  );
};
