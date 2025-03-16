import React from "react";

interface GameResultProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  score,
  totalQuestions,
  onRetry,
}) => {
  return (
    <div id="endGame" className="card">
      <div className="container">
        <h2>タイピング結果</h2>
        <div className="timer">
          {score}/{totalQuestions}
        </div>
        <div
          id="finalScore"
          data-testid="finalScore"
          className="result-message">
          あなたのスコアは{" "}
          <span
            id="correctAnswers"
            data-testid="correctAnswers"
            className="highlight-score">
            {score}
          </span>{" "}
          点 /{" "}
          <span id="totalQuestions" data-testid="totalQuestions">
            {totalQuestions}
          </span>{" "}
          問でした。
        </div>
        <button id="retryButton" className="button" onClick={onRetry}>
          再チャレンジ
        </button>
      </div>
    </div>
  );
};
