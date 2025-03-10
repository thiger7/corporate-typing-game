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
  const {
    gameState,
    startGame,
    handleInputChange,
    handleRetry,
    updateSettings,
  } = useTypingGame();

  const {
    currentWord,
    userInput,
    mistakeCount,
    questionsRemaining,
    questionLimit,
    score,
    isGameStarted,
    isGameOver,
  } = gameState;

  return (
    <div id="gameContainer">
      <Header />

      {/* ゲーム設定画面 */}
      {!isGameStarted && !isGameOver && (
        <MemoizedGameSettings
          questionLimit={questionLimit}
          onQuestionLimitChange={updateSettings}
          onStartGame={startGame}
        />
      )}

      {/* ゲーム進行画面 */}
      {isGameStarted && (
        <MemoizedGamePlay
          currentWord={currentWord}
          userInput={userInput}
          mistakeCount={mistakeCount}
          questionsRemaining={questionsRemaining}
          score={score}
          onInputChange={handleInputChange}
        />
      )}

      {/* ゲーム結果画面 */}
      {isGameOver && (
        <MemoizedGameResult
          score={score}
          totalQuestions={questionLimit}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

export default App;
