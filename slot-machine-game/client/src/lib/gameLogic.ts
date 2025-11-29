/**
 * Game Logic for Slot Machine
 * Implements the Gambler's Ruin theory with configurable probabilities
 */

export type Symbol = 'cherry' | 'bar' | 'bell' | 'seven';

export interface GameConfig {
  initialBalance: number;
  houseBalance: number;
  betAmount: number;
  winTarget: number;
  difficulty: 'easy' | 'medium' | 'hard'; // Controls house edge
}

export interface GameState {
  playerBalance: number;
  houseBalance: number;
  currentBet: number;
  roundNumber: number;
  isGameOver: boolean;
  gameOverReason: 'ruin' | 'victory' | 'none';
}

export interface GameRound {
  roundNumber: number;
  bet: number;
  symbols: [Symbol, Symbol, Symbol];
  result: 'win' | 'loss';
  payout: number;
  playerBalanceBefore: number;
  playerBalanceAfter: number;
  houseEdge: number;
}

// Symbol probabilities and payouts
export const SYMBOL_CONFIG: Record<Symbol, { probability: number; payout: number }> = {
  cherry: { probability: 0.40, payout: 2 },
  bar: { probability: 0.30, payout: 5 },
  bell: { probability: 0.20, payout: 10 },
  seven: { probability: 0.10, payout: 50 },
};

// Difficulty modifiers (affects house edge)
const DIFFICULTY_MODIFIERS: Record<string, number> = {
  easy: 0.95, // 5% house edge
  medium: 0.90, // 10% house edge
  hard: 0.85, // 15% house edge
};

/**
 * Get the probability of winning based on difficulty
 */
export function getWinProbability(difficulty: 'easy' | 'medium' | 'hard'): number {
  return DIFFICULTY_MODIFIERS[difficulty];
}

/**
 * Calculate expected value for a bet
 */
export function calculateExpectedValue(
  bet: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  const winProb = getWinProbability(difficulty);
  // Expected value = (win probability * average payout * bet) - (loss probability * bet)
  const avgPayout =
    SYMBOL_CONFIG.cherry.probability * SYMBOL_CONFIG.cherry.payout +
    SYMBOL_CONFIG.bar.probability * SYMBOL_CONFIG.bar.payout +
    SYMBOL_CONFIG.bell.probability * SYMBOL_CONFIG.bell.payout +
    SYMBOL_CONFIG.seven.probability * SYMBOL_CONFIG.seven.payout;

  // EV = (win prob * payout) - (loss prob * bet)
  return winProb * (avgPayout * bet) - (1 - winProb) * bet;
}

/**
 * Generate a random symbol based on probability distribution
 */
function generateSymbol(): Symbol {
  const rand = Math.random();
  let cumulative = 0;

  for (const [symbol, config] of Object.entries(SYMBOL_CONFIG)) {
    cumulative += config.probability;
    if (rand <= cumulative) {
      return symbol as Symbol;
    }
  }

  return 'cherry'; // Fallback
}

/**
 * Spin the slot machine and return the result
 */
export function spinSlot(
  config: GameConfig,
  currentBalance: number
): GameRound {
  const symbols: [Symbol, Symbol, Symbol] = [
    generateSymbol(),
    generateSymbol(),
    generateSymbol(),
  ];

  // Check if all three symbols are the same - isso é sempre uma vitória
  const isWin =
    symbols[0] === symbols[1] &&
    symbols[1] === symbols[2];

  // Calcular payout com base na dificuldade (house edge)
  let payout = 0;
  if (isWin) {
    const basePayout = config.betAmount * SYMBOL_CONFIG[symbols[0]].payout;
    const winProbability = getWinProbability(config.difficulty);
    // Aplicar house edge ao payout
    payout = Math.floor(basePayout * winProbability);
  }
  const playerBalanceAfter = currentBalance - config.betAmount + payout;

  // Calculate house edge for this round
  const houseEdge = payout > 0 ? (config.betAmount - payout) / config.betAmount : 1;

  return {
    roundNumber: 0, // Will be set by caller
    bet: config.betAmount,
    symbols,
    result: isWin ? 'win' : 'loss',
    payout,
    playerBalanceBefore: currentBalance,
    playerBalanceAfter: Math.max(0, playerBalanceAfter),
    houseEdge,
  };
}

/**
 * Check if game is over
 */
export function checkGameOver(
  playerBalance: number,
  winTarget: number,
  betAmount: number
): { isOver: boolean; reason: 'ruin' | 'victory' | 'none' } {
  // Player is ruined (no money left)
  if (playerBalance <= 0) {
    return { isOver: true, reason: 'ruin' };
  }

  // Player reached victory target
  if (playerBalance >= winTarget) {
    return { isOver: true, reason: 'victory' };
  }

  // Game continues - player still has money
  return { isOver: false, reason: 'none' };
}

/**
 * Calculate statistics for a series of rounds
 */
export interface GameStatistics {
  totalRounds: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalBetAmount: number;
  totalPayoutAmount: number;
  netProfit: number;
  averageHouseEdge: number;
}

export function calculateStatistics(rounds: GameRound[]): GameStatistics {
  const totalRounds = rounds.length;
  const totalWins = rounds.filter((r) => r.result === 'win').length;
  const totalLosses = totalRounds - totalWins;
  const totalBetAmount = rounds.reduce((sum, r) => sum + r.bet, 0);
  const totalPayoutAmount = rounds.reduce((sum, r) => sum + r.payout, 0);
  const netProfit = totalPayoutAmount - totalBetAmount;
  const averageHouseEdge =
    rounds.reduce((sum, r) => sum + r.houseEdge, 0) / totalRounds;

  return {
    totalRounds,
    totalWins,
    totalLosses,
    winRate: totalWins / totalRounds,
    totalBetAmount,
    totalPayoutAmount,
    netProfit,
    averageHouseEdge,
  };
}
