import React from "react";

interface GameSettingsProps {
  questionLimit: number;
  onQuestionLimitChange: (limit: number) => void;
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  questionLimit,
  onQuestionLimitChange,
  onStartGame,
}) => {
  return (
    <div id="settings" className="card">
      <label>出題数を選んでください:</label>
      <div>
        <input
          type="radio"
          id="limit10"
          name="questionLimit"
          value="10"
          checked={questionLimit === 10}
          onChange={() => onQuestionLimitChange(10)}
        />
        <label htmlFor="limit10">10問</label>
      </div>
      <div>
        <input
          type="radio"
          id="limit20"
          name="questionLimit"
          value="20"
          checked={questionLimit === 20}
          onChange={() => onQuestionLimitChange(20)}
        />
        <label htmlFor="limit20">20問</label>
      </div>
      <div>
        <input
          type="radio"
          id="limit30"
          name="questionLimit"
          value="30"
          checked={questionLimit === 30}
          onChange={() => onQuestionLimitChange(30)}
        />
        <label htmlFor="limit30">30問</label>
      </div>
      <button id="startButton" className="button" onClick={onStartGame}>
        開始
      </button>
    </div>
  );
};
