import { useState } from "react";
import "./App.css";
import { words } from "./data/words";
import { Word } from "./types";

function App() {
  const [currentWord, setCurrentWord] = useState<Word>({
    japanese: "",
    roman: "",
  });
  const [userInput, setUserInput] = useState("");
  const [mistakeCount, setMistakeCount] = useState(0);
  const [questionsRemaining, setQuestionsRemaining] = useState(0);
  const [questionLimit, setQuestionLimit] = useState(10);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const getRandomWord = (words: Word[]) => {
    return words[Math.floor(Math.random() * words.length)];
  };
  const displayNewWord = () => {
    setCurrentWord(getRandomWord(words));
    setUserInput("");
    setMistakeCount(0);
  };
  const startGame = () => {
    setScore(0);
    setQuestionsRemaining(questionLimit);
    setIsGameStarted(true);
    setIsGameOver(false);
    displayNewWord();
  };

  const endGameSequence = () => {
    setIsGameStarted(false);
    setIsGameOver(true);
  };

  const handleRetry = () => {
    setIsGameStarted(false);
    setIsGameOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInputValue = e.target.value;
    setUserInput(userInputValue);
    let mistakes = 0;

    for (let i = 0; i < userInputValue.length; i++) {
      if (userInputValue[i] !== currentWord.roman[i]) {
        mistakes++;
      }
    }

    setMistakeCount(mistakes);

    if (mistakes >= 2) {
      setQuestionsRemaining(questionsRemaining - 1);
      if (questionsRemaining > 0) {
        displayNewWord();
      } else {
        endGameSequence();
      }
    } else if (userInputValue === currentWord.roman) {
      setScore(score + 1);
      setQuestionsRemaining(questionsRemaining - 1);
      if (questionsRemaining > 0) {
        displayNewWord();
      } else {
        endGameSequence();
      }
    }
  };

  return (
    <div id="gameContainer">
      <div id="header">
        <h1>タイピングゲーム</h1>
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbD3SuxLoCGJyFOlF3MnAuhkXhfAnVYJGBcmzyN3vSFd9KXe6DHeNb64ob4kYN4z2ymyhEPw34exuVkqZKJJca5ojHTgxRcFhoi_iL-hUU5_tU5KP0suUJ-6ZR9rKN3PMISMqJ9FH0LCxg/s800/computer_typing_hayai.png"
          alt="タイピングゲーム"
        />
      </div>
      <p id="subText">プログラミングに挑戦してみよう！</p>
      {!isGameStarted && !isGameOver && (
        <div id="settings" className="card">
          <label htmlFor="questionSelect">出題数を選んでください:</label>
          <select
            id="questionSelect"
            value={questionLimit}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setQuestionLimit(Number(e.target.value))
            }>
            <option value="10">10問</option>
            <option value="20">20問</option>
            <option value="30">30問</option>
          </select>
          <button id="startButton" className="button" onClick={startGame}>
            開始
          </button>
        </div>
      )}
      {isGameStarted && (
        <div id="game" className="card">
          <div id="wordDisplay">{currentWord.japanese}</div>
          <div id="romanDisplay">{currentWord.roman}</div>
          <input
            type="text"
            id="userInput"
            value={userInput}
            onChange={handleInputChange}
            placeholder="ここにタイピングしてください"
          />
          <div id="score">スコア: {score}</div>
          <div id="questionCount">残りの出題数: {questionsRemaining}</div>
          <div id="mistakeCount">ミス: {mistakeCount}</div>
        </div>
      )}
      {isGameOver && (
        <div id="endGame" className="card">
          <div id="finalScore">
            あなたのスコアは <span id="correctAnswers">{score}</span> 点 /{" "}
            <span id="totalQuestions">{questionLimit}</span> 問でした。
          </div>
          <button id="retryButton" className="button" onClick={handleRetry}>
            再チャレンジ
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
