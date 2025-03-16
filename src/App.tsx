import React, { memo } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { GameSettings } from "./components/GameSettings";
import { GamePlay } from "./components/GamePlay";
import { GameResult } from "./components/GameResult";
import { useTypingGame } from "./hooks/useTypingGame";

// メモ化されたコンポーネント
const MemoizedGamePlay = memo(GamePlay);
const MemoizedGameResult = memo(GameResult);
const MemoizedGameSettings = memo(GameSettings);

function App() {
  const { gameState, typeStats, startGame, handleInputChange, handleRetry } =
    useTypingGame();

  const {
    currentWord,
    userInput,
    mistakeCount,
    timeLeft,
    score,
    isGameStarted,
    isGameOver,
    lastMistakeChar, // 追加: 最後に間違えた文字
  } = gameState;

  return (
    <div id="gameContainer">
      <Header />

      {/* ゲーム設定画面 */}
      {!isGameStarted && !isGameOver && (
        <MemoizedGameSettings onStartGame={startGame} />
      )}

      {/* ゲーム進行画面 */}
      {isGameStarted && (
        <MemoizedGamePlay
          currentWord={currentWord}
          userInput={userInput}
          mistakeCount={mistakeCount}
          timeLeft={timeLeft}
          score={score}
          combo={typeStats.combo}
          maxCombo={typeStats.maxCombo}
          accuracy={typeStats.accuracy}
          wordsCompleted={typeStats.wordsCompleted}
          lastMistakeChar={lastMistakeChar} // 追加
          onInputChange={handleInputChange}
        />
      )}

      {/* ゲーム結果画面 */}
      {isGameOver && (
        <MemoizedGameResult
          score={score}
          totalQuestions={typeStats.wordsCompleted}
          typeStats={typeStats}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

export default App;
