import { describe, it, expect } from 'vitest';
import {
  spinSlot,
  checkGameOver,
  calculateExpectedValue,
  SYMBOL_CONFIG,
  GameConfig,
} from './gameLogic';

describe('gameLogic', () => {
  const gameConfig: GameConfig = {
    initialBalance: 100,
    houseBalance: 10000,
    betAmount: 10,
    winTarget: 200,
    difficulty: 'medium',
  };

  describe('spinSlot', () => {
    it('should return a valid game round', () => {
      const round = spinSlot(gameConfig, 100);
      expect(round).toHaveProperty('symbols');
      expect(round).toHaveProperty('result');
      expect(round).toHaveProperty('payout');
      expect(round.symbols).toHaveLength(3);
    });

    it('should have valid symbols', () => {
      const round = spinSlot(gameConfig, 100);
      const validSymbols = Object.keys(SYMBOL_CONFIG);
      round.symbols.forEach((symbol) => {
        expect(validSymbols).toContain(symbol);
      });
    });

    it('should have result as win or loss', () => {
      const round = spinSlot(gameConfig, 100);
      expect(['win', 'loss']).toContain(round.result);
    });

    it('should calculate payout correctly for wins', () => {
      const round = spinSlot(gameConfig, 100);
      if (round.result === 'win') {
        const symbol = round.symbols[0];
        const expectedPayout = gameConfig.betAmount * SYMBOL_CONFIG[symbol].payout;
        expect(round.payout).toBe(expectedPayout);
      }
    });

    it('should have zero payout for losses', () => {
      const round = spinSlot(gameConfig, 100);
      if (round.result === 'loss') {
        expect(round.payout).toBe(0);
      }
    });

    it('should calculate correct player balance after round', () => {
      const round = spinSlot(gameConfig, 100);
      const expectedBalance = 100 - gameConfig.betAmount + round.payout;
      expect(round.playerBalanceAfter).toBe(Math.max(0, expectedBalance));
    });

    it('should not allow balance to go below 0', () => {
      const round = spinSlot(gameConfig, 5);
      expect(round.playerBalanceAfter).toBeGreaterThanOrEqual(0);
    });
  });

  describe('checkGameOver', () => {
    it('should detect ruin when balance is zero or negative', () => {
      let result = checkGameOver(0, 200, 10);
      expect(result.isOver).toBe(true);
      expect(result.reason).toBe('ruin');

      result = checkGameOver(-5, 200, 10);
      expect(result.isOver).toBe(true);
      expect(result.reason).toBe('ruin');
    });

    it('should allow game to continue when balance is less than bet amount but greater than 0', () => {
      const result = checkGameOver(5, 200, 10);
      expect(result.isOver).toBe(false);
      expect(result.reason).toBe('none');
    });

    it('should detect victory when balance reaches win target', () => {
      const result = checkGameOver(200, 200, 10);
      expect(result.isOver).toBe(true);
      expect(result.reason).toBe('victory');
    });

    it('should detect victory when balance exceeds win target', () => {
      const result = checkGameOver(250, 200, 10);
      expect(result.isOver).toBe(true);
      expect(result.reason).toBe('victory');
    });

    it('should continue game when balance is between 0 and win target', () => {
      const result = checkGameOver(150, 200, 10);
      expect(result.isOver).toBe(false);
      expect(result.reason).toBe('none');
    });
  });

  describe('calculateExpectedValue', () => {
    it('should return expected value based on difficulty', () => {
      const ev = calculateExpectedValue(10, 'medium');
      expect(typeof ev).toBe('number');
    });

    it('should return higher expected value for easier difficulty', () => {
      const easyEV = calculateExpectedValue(10, 'easy');
      const mediumEV = calculateExpectedValue(10, 'medium');
      const hardEV = calculateExpectedValue(10, 'hard');

      expect(easyEV).toBeGreaterThan(mediumEV);
      expect(mediumEV).toBeGreaterThan(hardEV);
    });

    it('should scale with bet amount', () => {
      const ev10 = calculateExpectedValue(10, 'medium');
      const ev20 = calculateExpectedValue(20, 'medium');

      expect(ev20).toBeCloseTo(ev10 * 2, 0);
    });
  });

  describe('probability distribution', () => {
    it('should generate wins with reasonable frequency', () => {
      let winCount = 0;
      const trials = 500;

      for (let i = 0; i < trials; i++) {
        const round = spinSlot(gameConfig, 1000);
        if (round.result === 'win') {
          winCount++;
        }
      }

      const winRate = winCount / trials;
      expect(winRate).toBeGreaterThan(0.02);
      expect(winRate).toBeLessThan(0.25);
    });

    it('should have all symbols in distribution', () => {
      const symbolCounts: Record<string, number> = {
        cherry: 0,
        bar: 0,
        bell: 0,
        seven: 0,
      };

      for (let i = 0; i < 300; i++) {
        const round = spinSlot(gameConfig, 1000);
        round.symbols.forEach((symbol) => {
          symbolCounts[symbol]++;
        });
      }

      Object.values(symbolCounts).forEach((count) => {
        expect(count).toBeGreaterThan(0);
      });
    });
  });

  describe('house edge calculation', () => {
    it('should calculate house edge correctly', () => {
      const round = spinSlot(gameConfig, 100);
      expect(round.houseEdge).toBeGreaterThanOrEqual(0);
      expect(round.houseEdge).toBeLessThanOrEqual(1);
    });
  });
});
