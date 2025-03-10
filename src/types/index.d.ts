export type Word = {
  japanese: string;
  roman: string;
};

export type GameState = {
  currentWord: Word;
  userInput: string;
  mistakeCount: number;
  questionsRemaining: number;
  questionLimit: number;
  score: number;
  isGameStarted: boolean;
  isGameOver: boolean;
};

export type GameSettings = {
  questionLimit: number;
};
