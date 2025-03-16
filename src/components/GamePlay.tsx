import React, { useRef, useEffect, useState } from "react";
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
  lastMistakeChar: string; // 最後に間違えた文字を追加
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
  lastMistakeChar,
  onInputChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  // 新しい単語が表示されたらエラー状態をリセット
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setHasError(false);
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
    
    // 各文字の状態を確認
    currentWord.roman.split("").forEach((char, index) => {
      if (index >= userInput.length) {
        // 次に入力する位置で、かつ間違いがあった場合
        if (index === userInput.length && lastMistakeChar) {
          // 次の文字に incorrect クラスを適用
          states.push("incorrect");
        } else {
          // まだ入力されていない文字は neutral
          states.push("neutral");
        }
      } else if (char === userInput[index]) {
        // 正しく入力された文字は correct
        states.push("correct");
      } else {
        // 間違った入力は起きないはず（実装上）
        // 念のため処理しておく
        states.push("neutral");
      }
    });

    return states;
  };

  // ユーザー入力の変更を処理する関数
  const handleInputChange = (value: string) => {
    // 前回の入力値との差分を取得
    const prevInput = userInput;
    
    // 新しい文字が入力されていない場合は処理しない
    if (value.length <= prevInput.length) {
      onInputChange(value);
      return;
    }
    
    // 新しく入力された文字
    const newChar = value.slice(prevInput.length)[0];
    if (!newChar) {
      // 新しい文字がなければ通常処理
      onInputChange(value);
      return;
    }
    
    // 次に期待される文字
    const nextIndex = prevInput.length;
    const expectedChar = currentWord.roman[nextIndex];
    
    console.log(`入力チェック - インデックス:${nextIndex}, 期待:${expectedChar || '終了'}, 入力:${newChar}`);
    
    // 入力された文字が正しいかどうかを確認
    if (expectedChar && newChar !== expectedChar) {
      console.log(`ミスを検出: 期待 "${expectedChar}", 入力 "${newChar}"`);
      setHasError(true);
    } else if (!expectedChar) {
      // 入力が単語の長さを超えた場合
      console.log(`単語の長さを超える入力: ${value}`);
    }
    
    // 親コンポーネントの処理を呼び出す
    onInputChange(value);
  };

  // 単語を表示する関数
  const renderWord = () => {
    const characterStates = getCharacterStates();
    const chars = currentWord.roman.split("");
    
    // 最後に間違えた文字がある場合の表示を調整
    return (
      <div className="word-container">
        {/* お題のスペルを表示 */}
        <div className="expected-word">
          {chars.map((char, index) => (
            <span 
              key={index} 
              className={index === userInput.length && lastMistakeChar ? "incorrect" : characterStates[index]}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  };

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
          {renderWord()}
        </div>

        {/* 非表示の入力フィールド */}
        <input
          ref={inputRef}
          id="typeInput"
          className="hidden-input"
          value={userInput}
          onChange={e => handleInputChange(e.target.value)}
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
