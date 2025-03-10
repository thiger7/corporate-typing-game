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
      <div id="finalScore" data-testid="finalScore">
        あなたのスコアは{" "}
        <span id="correctAnswers" data-testid="correctAnswers">
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
  );
};
