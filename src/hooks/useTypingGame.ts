import { useState, useEffect, useCallback, useRef } from "react";
import { Word, GameState, TypeStats } from "../types";
import { words } from "../data/words";

// ゲーム関連の定数
const DEFAULT_TIME_LIMIT = 100; // 100秒制限
const COMBO_THRESHOLD = 5; // コンボボーナスの閾値

export const useTypingGame = (timeLimit = DEFAULT_TIME_LIMIT) => {
  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>({
    currentWord: { japanese: "", roman: "" },
    userInput: "",
    mistakeCount: 0,
    questionsRemaining: 0,
    questionLimit: 0, // 不要だが型の互換性のために維持
    timeLeft: timeLimit,
    score: 0,
    isGameStarted: false,
    isGameOver: false,
  });

  // タイプ統計データ
  const [typeStats, setTypeStats] = useState<TypeStats>({
    totalTyped: 0,
    correctTyped: 0,
    mistakeTyped: 0,
    combo: 0,
    maxCombo: 0,
    startTime: null,
    wordsCompleted: 0,
    accuracy: 100,
    typingSpeed: 0,
    detailedScores: {
      baseScore: 0,
      comboBonus: 0,
      speedBonus: 0,
      accuracyBonus: 0,
      completionBonus: 0, // 完走ボーナスは使用しないが型の互換性のために維持
    },
  });

  // タイマー参照
  const timerRef = useRef<number | null>(null);

  // 音声ファイルの読み込み
  const typeSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const comboSoundRef = useRef<HTMLAudioElement | null>(null);

  // 音声ファイルを初期化
  useEffect(() => {
    typeSoundRef.current = new Audio("/audio/typing-sound.mp3");
    wrongSoundRef.current = new Audio("/audio/wrong.mp3");
    correctSoundRef.current = new Audio("/audio/correct.mp3");
    comboSoundRef.current = new Audio("/audio/combo.mp3"); // コンボ音（必要に応じて追加）

    // ボリュームの設定
    if (wrongSoundRef.current) {
      wrongSoundRef.current.volume = 0.3;
    }

    if (comboSoundRef.current) {
      comboSoundRef.current.volume = 0.5;
    }

    return () => {
      // クリーンアップ
      typeSoundRef.current = null;
      wrongSoundRef.current = null;
      correctSoundRef.current = null;
      comboSoundRef.current = null;
    };
  }, []);

  // 音を再生する関数
  const playSound = useCallback(
    (sound: "type" | "wrong" | "correct" | "combo") => {
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
        case "combo":
          audio = comboSoundRef.current;
          break;
      }

      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("音声の再生に失敗しました", e));
      }
    },
    [],
  );

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

  // タイマーを更新する関数
  const updateTimer = useCallback(() => {
    setGameState(prev => {
      const newTimeLeft = prev.timeLeft - 1;

      // 時間切れの場合はゲーム終了
      if (newTimeLeft <= 0) {
        // タイマーをクリア
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // 最終スコアを計算
        calculateFinalScore();

        return {
          ...prev,
          timeLeft: 0,
          isGameStarted: false,
          isGameOver: true,
        };
      }

      return {
        ...prev,
        timeLeft: newTimeLeft,
      };
    });
  }, []);

  // ゲームを開始する関数
  const startGame = useCallback(() => {
    // タイプ統計をリセット
    setTypeStats({
      totalTyped: 0,
      correctTyped: 0,
      mistakeTyped: 0,
      combo: 0,
      maxCombo: 0,
      startTime: new Date(),
      wordsCompleted: 0,
      accuracy: 100,
      typingSpeed: 0,
      detailedScores: {
        baseScore: 0,
        comboBonus: 0,
        speedBonus: 0,
        accuracyBonus: 0,
        completionBonus: 0,
      },
    });

    // ゲーム状態を更新
    setGameState(prev => ({
      ...prev,
      score: 0,
      timeLeft: timeLimit,
      isGameStarted: true,
      isGameOver: false,
    }));

    // タイマーをスタート
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(updateTimer, 1000);
  }, [timeLimit, updateTimer]);

  // 最終スコアを計算する関数
  const calculateFinalScore = useCallback(() => {
    setTypeStats(prev => {
      // タイピングスピードを計算（1分あたりの文字数）
      const endTime = new Date();
      const elapsedMinutes = prev.startTime
        ? (endTime.getTime() - prev.startTime.getTime()) / 60000
        : 1;
      const typingSpeed = Math.round(prev.totalTyped / elapsedMinutes);

      // 正確率を計算
      const accuracy =
        prev.totalTyped > 0
          ? Math.round((prev.correctTyped / prev.totalTyped) * 100)
          : 100;

      // 基本スコアは正確にタイプした文字数
      const baseScore = prev.correctTyped;

      // コンボボーナス（最大コンボ数に応じて）
      const comboBonus = Math.floor(prev.maxCombo / 10) * 100;

      // スピードボーナス（タイピング速度に応じて）
      const speedBonus = Math.floor(typingSpeed / 50) * 200;

      // 正確性ボーナス（正確率に応じて）
      const accuracyBonus = Math.floor(accuracy / 10) * 100;

      // 完走ボーナスは削除（常に0）
      const completionBonus = 0;

      // 最終スコアを計算
      const totalScore =
        baseScore + comboBonus + speedBonus + accuracyBonus + completionBonus;

      // ゲーム状態の更新
      setGameState(gs => ({
        ...gs,
        score: totalScore,
      }));

      return {
        ...prev,
        typingSpeed,
        accuracy,
        detailedScores: {
          baseScore,
          comboBonus,
          speedBonus,
          accuracyBonus,
          completionBonus,
        },
      };
    });
  }, []);

  // ゲームを終了する関数
  const endGameSequence = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    calculateFinalScore();

    setGameState(prev => ({
      ...prev,
      isGameStarted: false,
      isGameOver: true,
    }));
  }, [calculateFinalScore]);

  // 再チャレンジする関数
  const handleRetry = useCallback(() => {
    // タイマーをクリア
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setGameState(prev => ({
      ...prev,
      score: 0,
      currentWord: { japanese: "", roman: "" },
      userInput: "",
      mistakeCount: 0,
      timeLeft: timeLimit,
      isGameStarted: false,
      isGameOver: false,
    }));

    // タイプ統計もリセット
    setTypeStats({
      totalTyped: 0,
      correctTyped: 0,
      mistakeTyped: 0,
      combo: 0,
      maxCombo: 0,
      startTime: null,
      wordsCompleted: 0,
      accuracy: 100,
      typingSpeed: 0,
      detailedScores: {
        baseScore: 0,
        comboBonus: 0,
        speedBonus: 0,
        accuracyBonus: 0,
        completionBonus: 0,
      },
    });
  }, [timeLimit]);

  // 前回のミス状態を保持して不要な音を鳴らさないようにするための参照
  const prevMistakesRef = useRef<{ [key: number]: boolean }>({});
  const lastCorrectCharRef = useRef<number>(-1);

  // ユーザーの入力を処理する関数
  const handleInputChange = useCallback(
    (value: string) => {
      // タイプ音を再生
      playSound("type");

      // 現在の単語と比較して間違いの数を計算
      const currentMistakes: { [key: number]: boolean } = {};
      let newMistakeCount = 0;
      let correctCount = 0;
      let consecutiveCorrect = true;

      value.split("").forEach((char, index) => {
        if (index < gameState.currentWord.roman.length) {
          const isMistake = char !== gameState.currentWord.roman[index];
          currentMistakes[index] = isMistake;

          if (isMistake) {
            newMistakeCount++;
            consecutiveCorrect = false;

            // 新しいミスが発生した場合、間違い音を鳴らす
            if (!prevMistakesRef.current[index]) {
              playSound("wrong");

              // タイプ統計を更新
              setTypeStats(prev => ({
                ...prev,
                totalTyped: prev.totalTyped + 1,
                mistakeTyped: prev.mistakeTyped + 1,
                combo: 0, // コンボをリセット
                accuracy: Math.round(
                  (prev.correctTyped / (prev.totalTyped + 1)) * 100,
                ),
              }));
            }
          } else {
            correctCount++;
            // 正しく入力された文字の最後のインデックスを更新
            if (index > lastCorrectCharRef.current) {
              lastCorrectCharRef.current = index;

              // タイプ統計を更新
              setTypeStats(prev => {
                const newCombo = prev.combo + 1;
                const newMaxCombo = Math.max(prev.maxCombo, newCombo);

                // コンボ閾値を超えたらコンボ音を鳴らす
                if (newCombo > 0 && newCombo % COMBO_THRESHOLD === 0) {
                  playSound("combo");
                }

                return {
                  ...prev,
                  totalTyped: prev.totalTyped + 1,
                  correctTyped: prev.correctTyped + 1,
                  combo: newCombo,
                  maxCombo: newMaxCombo,
                  accuracy: Math.round(
                    ((prev.correctTyped + 1) / (prev.totalTyped + 1)) * 100,
                  ),
                };
              });
            }
          }
        }
      });

      // 現在のミス状態を更新
      prevMistakesRef.current = currentMistakes;

      // ゲーム状態を更新
      setGameState(prev => ({
        ...prev,
        userInput: value,
        mistakeCount: newMistakeCount,
      }));

      // すべての文字が正しく入力されていて、文の長さと入力の長さが同じ場合
      if (
        correctCount === gameState.currentWord.roman.length &&
        value.length === gameState.currentWord.roman.length
      ) {
        // 正解音を鳴らす
        playSound("correct");

        // 単語完了のステータスを更新
        setTypeStats(prev => ({
          ...prev,
          wordsCompleted: prev.wordsCompleted + 1,
        }));

        // 次の問題を表示
        setTimeout(() => {
          setGameState(state => ({
            ...state,
            currentWord: getRandomWord(words),
            userInput: "",
            mistakeCount: 0,
          }));

          // リファレンスをリセット
          lastCorrectCharRef.current = -1;
          prevMistakesRef.current = {};
        }, 300);
      }
    },
    [gameState.currentWord.roman, getRandomWord, playSound],
  );

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // 初回のゲーム開始時に新しい単語を表示
  useEffect(() => {
    if (gameState.isGameStarted && gameState.currentWord.japanese === "") {
      displayNewWord();
    }
  }, [gameState.isGameStarted, gameState.currentWord.japanese, displayNewWord]);

  return {
    gameState,
    typeStats,
    startGame,
    handleInputChange,
    handleRetry,
    displayNewWord,
    calculateFinalScore,
  };
};
