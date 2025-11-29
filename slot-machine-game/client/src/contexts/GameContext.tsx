import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  GameConfig,
  GameState,
  GameRound,
  spinSlot,
  checkGameOver,
  calculateStatistics,
  GameStatistics,
} from '@/lib/gameLogic';

interface GameContextType {
  // State
  gameConfig: GameConfig;
  gameState: GameState;
  rounds: GameRound[];
  statistics: GameStatistics | null;
  isAutoPlaying: boolean;
  shouldStopAutoPlay: boolean;

  // Actions
  initializeGame: (config: GameConfig) => void;
  playRound: () => void;
  playAutomatic: (numberOfRounds: number) => Promise<void>;
  resetGame: () => void;
  updateDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  updateBetAmount: (betAmount: number) => void;
  stopAutoPlay: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const defaultConfig: GameConfig = {
    initialBalance: 100,
    houseBalance: 10000,
    betAmount: 10,
    winTarget: 200,
    difficulty: 'medium',
  };

  const [gameConfig, setGameConfig] = useState<GameConfig>(defaultConfig);
  const [gameState, setGameState] = useState<GameState>({
    playerBalance: defaultConfig.initialBalance,
    houseBalance: defaultConfig.houseBalance,
    currentBet: defaultConfig.betAmount,
    roundNumber: 0,
    isGameOver: false,
    gameOverReason: 'none',
  });
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [shouldStopAutoPlay, setShouldStopAutoPlay] = useState(false);

  const initializeGame = useCallback((config: GameConfig) => {
    setGameConfig(config);
    setGameState({
      playerBalance: config.initialBalance,
      houseBalance: config.houseBalance,
      currentBet: config.betAmount,
      roundNumber: 0,
      isGameOver: false,
      gameOverReason: 'none',
    });
    setRounds([]);
    setStatistics(null);
  }, []);

  const playRound = useCallback(() => {
    if (isAutoPlaying || gameState.isGameOver) return;

    const round = spinSlot(gameConfig, gameState.playerBalance);
    const newRoundNumber = gameState.roundNumber + 1;
    const newPlayerBalance = round.playerBalanceAfter;
    const newHouseBalance = gameState.houseBalance + gameState.currentBet - round.payout;

    const gameOverCheck = checkGameOver(newPlayerBalance, gameConfig.winTarget, gameConfig.betAmount);

    const updatedRound: GameRound = {
      ...round,
      roundNumber: newRoundNumber,
    };

    const newRounds = [...rounds, updatedRound];
    setRounds(newRounds);

    setGameState({
      playerBalance: newPlayerBalance,
      houseBalance: newHouseBalance,
      currentBet: gameConfig.betAmount,
      roundNumber: newRoundNumber,
      isGameOver: gameOverCheck.isOver,
      gameOverReason: gameOverCheck.reason,
    });

    // Always calculate statistics after each round
    setStatistics(calculateStatistics(newRounds));
  }, [gameState, gameConfig, rounds]);

  const playAutomatic = useCallback(
    async (numberOfRounds: number) => {
      setIsAutoPlaying(true);
      setShouldStopAutoPlay(false);
      let currentBalance = gameState.playerBalance;
      let currentHouseBalance = gameState.houseBalance;
      const newRounds = [...rounds];
      let roundNum = gameState.roundNumber;

      for (let i = 0; i < numberOfRounds; i++) {
        // Check if should stop
        if (shouldStopAutoPlay) {
          break;
        }

        // Check if game is over (only ruin or victory)
        if (currentBalance <= 0 || currentBalance >= gameConfig.winTarget) {
          break;
        }

        // Note: Removed the check for playerBalance < betAmount
        // This was causing premature game over. Player can continue as long as they have any balance > 0

        // Wait for spinning animation (800ms like manual spin)
        await new Promise((resolve) => setTimeout(resolve, 800));

        const round = spinSlot(gameConfig, currentBalance);
        roundNum++;
        currentBalance = round.playerBalanceAfter;
        currentHouseBalance = currentHouseBalance + gameConfig.betAmount - round.payout;

        newRounds.push({
          ...round,
          roundNumber: roundNum,
        });

        // Update state every round for smooth animation
        setRounds([...newRounds]);
        setGameState((prev) => ({
          ...prev,
          playerBalance: currentBalance,
          houseBalance: currentHouseBalance,
          roundNumber: roundNum,
        }));
        
        // Longer delay between rounds for clarity (shows result + pause before next spin)
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      const gameOverCheck = checkGameOver(currentBalance, gameConfig.winTarget, gameConfig.betAmount);

      setRounds(newRounds);
      setGameState({
        playerBalance: currentBalance,
        houseBalance: currentHouseBalance,
        currentBet: gameConfig.betAmount,
        roundNumber: roundNum,
        isGameOver: gameOverCheck.isOver,
        gameOverReason: gameOverCheck.reason,
      });

      // Always calculate statistics after auto play
      setStatistics(calculateStatistics(newRounds));

      setIsAutoPlaying(false);
      setShouldStopAutoPlay(false);
      
      // Reset game state to allow further plays
      const finalGameOverCheck = checkGameOver(currentBalance, gameConfig.winTarget, gameConfig.betAmount);
      if (!finalGameOverCheck.isOver) {
        // Game is not over, allow more plays
        setGameState((prev) => ({
          ...prev,
          isGameOver: false,
          gameOverReason: 'none',
        }));
      }
    },
    [gameState, gameConfig, rounds, shouldStopAutoPlay]
  );

  const resetGame = useCallback(() => {
    initializeGame(gameConfig);
    setStatistics({
      totalRounds: 0,
      totalWins: 0,
      totalLosses: 0,
      totalBetAmount: 0,
      totalPayoutAmount: 0,
      netProfit: 0,
      winRate: 0,
      averageHouseEdge: 0,
    });
  }, [gameConfig]);

  const updateDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    resetGame();
    setGameConfig((prev) => ({
      ...prev,
      difficulty,
    }));
  }, [resetGame]);

  const updateBetAmount = useCallback((betAmount: number) => {
    setGameConfig((prev) => ({
      ...prev,
      betAmount: Math.max(1, Math.min(betAmount, prev.initialBalance)),
    }));
  }, []);

  const stopAutoPlay = useCallback(() => {
    setShouldStopAutoPlay(true);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameConfig,
        gameState,
        rounds,
        statistics,
        isAutoPlaying,
        shouldStopAutoPlay,
        initializeGame,
        playRound,
        playAutomatic,
        resetGame,
        updateDifficulty,
        updateBetAmount,
        stopAutoPlay,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
