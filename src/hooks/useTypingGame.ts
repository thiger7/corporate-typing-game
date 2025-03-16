import { useState, useEffect, useCallback, useRef } from "react";
import { Word, GameState } from "../types";
import { words } from "../data/words";

// ゲーム関連の定数
const DEFAULT_QUESTION_LIMIT = 10;
const MISTAKE_THRESHOLD = 2;

export const useTypingGame = (
  initialQuestionLimit = DEFAULT_QUESTION_LIMIT,
) => {
  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>({
    currentWord: { japanese: "", roman: "" },
    userInput: "",
    mistakeCount: 0,
    questionsRemaining: 0,
    questionLimit: initialQuestionLimit,
    score: 0,
    isGameStarted: false,
    isGameOver: false,
  });

  // 音声ファイルの読み込み
  const typeSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);

  // 音声ファイルを初期化
  useEffect(() => {
    typeSoundRef.current = new Audio("/audio/typing-sound.mp3");
    wrongSoundRef.current = new Audio("/audio/wrong.mp3");
    correctSoundRef.current = new Audio("/audio/correct.mp3");

    // ボリュームの設定
    if (wrongSoundRef.current) {
      wrongSoundRef.current.volume = 0.3;
    }

    return () => {
      // クリーンアップ
      typeSoundRef.current = null;
      wrongSoundRef.current = null;
      correctSoundRef.current = null;
    };
  }, []);

  // 音を再生する関数
  const playSound = useCallback((sound: "type" | "wrong" | "correct") => {
    let audio: HTMLAudioElement | null = null;

    switch (sound) {
      case "type":
        audio = typeSoundRef.current;
        break;
      case "wrong":
        audio = wrongSoundRef.current;
        break;
      case "correct":
        audio = correctSoundRef.current;
        break;
    }

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("音声の再生に失敗しました", e));
    }
  }, []);

  // ランダムな単語を取得する関数
  const getRandomWord = useCallback((wordList: Word[]): Word => {
    return wordList[Math.floor(Math.random() * wordList.length)];
  }, []);

  // 新しい単語を表示する関数
  const displayNewWord = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentWord: getRandomWord(words),
      userInput: "",
      mistakeCount: 0,
    }));
  }, [getRandomWord]);

  // ゲームを開始する関数
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      questionsRemaining: prev.questionLimit,
      isGameStarted: true,
      isGameOver: false,
    }));
  }, []);

  // ゲーム設定を変更する関数
  const updateSettings = useCallback((questionLimit: number) => {
    setGameState(prev => ({
      ...prev,
      questionLimit,
    }));
  }, []);

  // ゲームを終了する関数
  const endGameSequence = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameStarted: false,
      isGameOver: true,
    }));
  }, []);

  // 再チャレンジする関数
  const handleRetry = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      questionsRemaining: prev.questionLimit, // Reset question count to the full limit
      currentWord: { japanese: "", roman: "" }, // Reset current word
      userInput: "", // Reset user input
      mistakeCount: 0, // Reset mistake count
      isGameStarted: false,
      isGameOver: false,
    }));
  }, []);

  // 前回のミス状態を保持して不要な音を鳴らさないようにするための参照
  const prevMistakesRef = useRef<{ [key: number]: boolean }>({});

  // ユーザーの入力を処理する関数
  const handleInputChange = useCallback(
    (value: string) => {
      // タイプ音を再生
      playSound("type");

      // 現在の単語と比較して間違いの数を計算
      const currentMistakes: { [key: number]: boolean } = {};
      const mistakeCount = value.split("").reduce((count, char, index) => {
        const isMistake = char !== gameState.currentWord.roman[index];
        currentMistakes[index] = isMistake;

        // 新しいミスが発生した場合、間違い音を鳴らす
        if (isMistake && !prevMistakesRef.current[index]) {
          playSound("wrong");
        }

        return isMistake ? count + 1 : count;
      }, 0);

      // 現在のミス状態を更新
      prevMistakesRef.current = currentMistakes;

      setGameState(prev => ({
        ...prev,
        userInput: value,
        mistakeCount,
      }));
    },
    [gameState.currentWord.roman, playSound],
  );

  // ゲームの進行を管理する副作用
  useEffect(() => {
    // ゲームが始まっていない、または入力がない場合は何もしない
    if (!gameState.isGameStarted || gameState.userInput.length === 0) return;

    let shouldUpdateQuestion = false;
    let shouldUpdateScore = false;

    // 正解の場合
    if (gameState.userInput === gameState.currentWord.roman) {
      shouldUpdateScore = true;
      shouldUpdateQuestion = true;
      playSound("correct"); // 正解音を鳴らす
    }
    // 一定数以上のミスがある場合
    else if (gameState.mistakeCount >= MISTAKE_THRESHOLD) {
      shouldUpdateQuestion = true;
    }

    // スコアと残り問題数の更新が必要な場合
    if (shouldUpdateQuestion || shouldUpdateScore) {
      setGameState(prev => {
        const newQuestionsRemaining = prev.questionsRemaining - 1;
        const newScore = shouldUpdateScore ? prev.score + 1 : prev.score;

        // 最終問題の場合はゲーム終了、それ以外は次の問題へ
        if (newQuestionsRemaining <= 0) {
          return {
            ...prev,
            questionsRemaining: newQuestionsRemaining,
            score: newScore,
            isGameStarted: false,
            isGameOver: true,
          };
        } else {
          // 次の問題用に状態をリセット
          return {
            ...prev,
            currentWord: getRandomWord(words),
            userInput: "",
            mistakeCount: 0,
            questionsRemaining: newQuestionsRemaining,
            score: newScore,
          };
        }
      });

      // ミス状態をリセット
      prevMistakesRef.current = {};
    }
  }, [
    gameState.userInput,
    gameState.mistakeCount,
    gameState.currentWord.roman,
    gameState.isGameStarted,
    gameState.questionsRemaining,
    getRandomWord,
    playSound,
  ]);

  // 初回のゲーム開始時に新しい単語を表示
  useEffect(() => {
    if (gameState.isGameStarted && gameState.currentWord.japanese === "") {
      displayNewWord();
    }
  }, [gameState.isGameStarted, gameState.currentWord.japanese, displayNewWord]);

  return {
    gameState,
    startGame,
    handleInputChange,
    handleRetry,
    updateSettings,
    displayNewWord,
  };
};
