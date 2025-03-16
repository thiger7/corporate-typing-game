import React from "react";

interface GameSettingsProps {
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ onStartGame }) => {
  return (
    <div id="settings" className="card">
      <div className="container">
        <div className="settings-section">
          <h2>- Typing Game -</h2>
          <p style={{ fontSize: "0.5em" }}>
            ビジネス用語をタイピングしてスコアを競おう！
          </p>
        </div>
        <button id="startButton" className="button" onClick={onStartGame}>
          タイピング開始
        </button>
      </div>
    </div>
  );
};
