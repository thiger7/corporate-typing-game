import React from "react";

interface GameSettingsProps {
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ onStartGame }) => {
  return (
    <div id="settings" className="card">
      <div className="container">
        <h2>タイピングゲームの設定</h2>
        <div className="settings-section">
          <p className="time-limit-info">制限時間: 100秒</p>
          <p className="game-description">
            制限時間内にできるだけ多くの単語を正確にタイプしましょう！
          </p>
        </div>
        <button id="startButton" className="button" onClick={onStartGame}>
          タイピング開始
        </button>
      </div>
    </div>
  );
};
