import { useState, useEffect, useCallback } from 'react';
import { Word, GameState } from '../types';
import { words } from '../data/words';

// ゲーム関連の定数
const DEFAULT_QUESTION_LIMIT = 10;
const MISTAKE_THRESHOLD = 2;

export const useTypingGame = (initialQuestionLimit = DEFAULT_QUESTION_LIMIT) => {
  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>({
    currentWord: { japanese: "", roman: "" },
    userInput: "",
    mistakeCount: 0,
    questionsRemaining: 0,
    questionLimit: initialQuestionLimit,
    score: 0,
    isGameStarted: false,
    isGameOver: false
  });

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
      mistakeCount: 0
    }));
  }, [getRandomWord]);

  // ゲームを開始する関数
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      questionsRemaining: prev.questionLimit,
      isGameStarted: true,
      isGameOver: false
    }));
  }, []);

  // ゲーム設定を変更する関数
  const updateSettings = useCallback((questionLimit: number) => {
    setGameState(prev => ({
      ...prev,
      questionLimit
    }));
  }, []);

  // ゲームを終了する関数
  const endGameSequence = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameStarted: false,
      isGameOver: true
    }));
  }, []);

  // 再チャレンジする関数
  const handleRetry = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameStarted: false,
      isGameOver: false
    }));
  }, []);

  // ユーザーの入力を処理する関数
  const handleInputChange = useCallback((value: string) => {
    // 現在の単語と比較して間違いの数を計算
    const currentMistakes = value
      .split("")
      .reduce((count, char, index) => {
        return char !== gameState.currentWord.roman[index] ? count + 1 : count;
      }, 0);
    
    setGameState(prev => ({
      ...prev,
      userInput: value,
      mistakeCount: currentMistakes
    }));
  }, [gameState.currentWord.roman]);

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
            isGameOver: true
          };
        } else {
          // 次の問題用に状態をリセット
          return {
            ...prev,
            currentWord: getRandomWord(words),
            userInput: "",
            mistakeCount: 0,
            questionsRemaining: newQuestionsRemaining,
            score: newScore
          };
        }
      });
    }
  }, [gameState.userInput, gameState.mistakeCount, gameState.currentWord.roman, 
      gameState.isGameStarted, gameState.questionsRemaining, getRandomWord]);

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
    displayNewWord
  };
};