import React, { useRef, useEffect } from "react";
import { Word } from "../types";

interface GamePlayProps {
  currentWord: Word;
  userInput: string;
  mistakeCount: number;
  timeLeft: number;
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  wordsCompleted: number;
  onInputChange: (value: string) => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  currentWord,
  userInput,
  mistakeCount,
  timeLeft,
  score,
  combo,
  maxCombo,
  accuracy,
  wordsCompleted,
  onInputChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ゲームエリア全体へのフォーカスを管理するref
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // 自動的に入力フィールドにフォーカスする
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);

  // ゲームエリアがクリックされた時に入力フィールドにフォーカスする
  const handleGameAreaClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
    <div
      id="game"
      className="card"
      ref={gameAreaRef}
      onClick={handleGameAreaClick}
      tabIndex={0}>
      <div className="game-header">
        <div className="timer" id="timer">
          {timeLeft}
        </div>
        <div className="combo-display">
          <div className="combo">コンボ: {combo}</div>
          <div className="max-combo">最大コンボ: {maxCombo}</div>
        </div>
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

        {/* 非表示の入力フィールド */}
        <input
          ref={inputRef}
          id="typeInput"
          className="hidden-input"
          value={userInput}
          onChange={e => onInputChange(e.target.value)}
          autoFocus
        />

        <div className="typing-instruction">
          キーボードで入力してください。入力中のテキストは上に表示されます。
        </div>

        <div className="game-stats">
          <div id="score">スコア: {score}</div>
          <div id="completed">完了単語数: {wordsCompleted}</div>
          <div id="accuracy">正確率: {accuracy}%</div>
        </div>
      </div>
    </div>
  );
};
