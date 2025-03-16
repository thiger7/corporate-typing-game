import React from "react";

interface GameSettingsProps {
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ onStartGame }) => {
  return (
    <div id="settings" className="card">
      <div className="container">
        <div className="settings-section">
          <p className="game-description">
          100秒内にできるだけ多くの単語を正確にタイプしましょう！
          </p>
        </div>
        <button id="startButton" className="button" onClick={onStartGame}>
          タイピング開始
        </button>
      </div>
    </div>
  );
};
