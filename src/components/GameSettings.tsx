import React from 'react';

interface GameSettingsProps {
  questionLimit: number;
  onQuestionLimitChange: (limit: number) => void;
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  questionLimit,
  onQuestionLimitChange,
  onStartGame
}) => {
  return (
    <div id="settings" className="card">
      <label htmlFor="questionSelect">出題数を選んでください:</label>
      <select
        id="questionSelect"
        value={questionLimit}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onQuestionLimitChange(Number(e.target.value))
        }
      >
        <option value="10">10問</option>
        <option value="20">20問</option>
        <option value="30">30問</option>
      </select>
      <button id="startButton" className="button" onClick={onStartGame}>
        開始
      </button>
    </div>
  );
};