import React from "react";
import { TypeStats } from "../types";

interface GameResultProps {
  score: number;
  totalQuestions: number;
  typeStats: TypeStats;
  onRetry: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  score,
  totalQuestions,
  typeStats,
  onRetry,
}) => {
  return (
    <div id="endGame" className="card">
      <div className="container result-container">
        <h2>タイピング結果</h2>
        <div className="total-score">
          <div className="score-value">{score}</div>
          <div className="score-label">総合スコア</div>
        </div>

        <div className="stats-container">
          <div className="stats-row">
            <div className="stats-item">
              <div className="stats-value">{typeStats.accuracy}%</div>
              <div className="stats-label">正確率</div>
            </div>
            <div className="stats-item">
              <div className="stats-value">{typeStats.typingSpeed}</div>
              <div className="stats-label">タイピング速度(文字/分)</div>
            </div>
          </div>
          <div className="stats-row">
            <div className="stats-item">
              <div className="stats-value">{typeStats.wordsCompleted}</div>
              <div className="stats-label">完了問題数 / {totalQuestions}</div>
            </div>
            <div className="stats-item">
              <div className="stats-value">{typeStats.maxCombo}</div>
              <div className="stats-label">最大コンボ</div>
            </div>
          </div>
        </div>

        <div className="result-sections">
          <div className="detailed-scores">
            <h3>詳細スコア</h3>
            <table className="score-details">
              <tbody>
                <tr>
                  <td>基本スコア:</td>
                  <td>{typeStats.detailedScores.baseScore}</td>
                  <td>(正確にタイプした文字数)</td>
                </tr>
                <tr>
                  <td>コンボボーナス:</td>
                  <td>{typeStats.detailedScores.comboBonus}</td>
                  <td>(最大コンボ: {typeStats.maxCombo})</td>
                </tr>
                <tr>
                  <td>スピードボーナス:</td>
                  <td>{typeStats.detailedScores.speedBonus}</td>
                  <td>({typeStats.typingSpeed} 文字/分)</td>
                </tr>
                <tr>
                  <td>正確性ボーナス:</td>
                  <td>{typeStats.detailedScores.accuracyBonus}</td>
                  <td>(正確率: {typeStats.accuracy}%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="typing-stats">
            <h3>入力統計</h3>
            <div className="typing-stats-row">
              <div className="typing-stats-item">
                入力文字数:{" "}
                <span className="highlight">{typeStats.totalTyped}</span>
              </div>
              <div className="typing-stats-item">
                正確:{" "}
                <span className="highlight-success">
                  {typeStats.correctTyped}
                </span>
              </div>
              <div className="typing-stats-item">
                ミス:{" "}
                <span className="highlight-error">
                  {typeStats.mistakeTyped}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button id="retryButton" className="button" onClick={onRetry}>
          再チャレンジ
        </button>
      </div>
    </div>
  );
};
