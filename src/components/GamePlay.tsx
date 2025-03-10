import React, { useRef, useEffect } from 'react';
import { Word } from '../types';

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
  onInputChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 自動的にテキスト入力フィールドにフォーカスする
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);

  return (
    <div id="game" className="card">
      <div id="wordDisplay">{currentWord.japanese}</div>
      <div id="romanDisplay">{currentWord.roman}</div>
      <input
        ref={inputRef}
        type="text"
        id="userInput"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="ここにタイピングしてください"
        autoFocus
      />
      <div className="game-stats">
        <div id="score">スコア: {score}</div>
        <div id="questionCount">残りの出題数: {questionsRemaining}</div>
        <div id="mistakeCount">ミス: {mistakeCount}</div>
      </div>
    </div>
  );
};