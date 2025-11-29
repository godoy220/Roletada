import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { SlotReel } from './SlotReel';
import { AutoPlayModal } from './AutoPlayModal';
import { calculateExpectedValue } from '@/lib/gameLogic';
import { AlertCircle, Play, RotateCcw, Zap, Plus, Minus, Square } from 'lucide-react';

export function SlotMachine() {
  const {
    gameConfig,
    gameState,
    rounds,
    playRound,
    playAutomatic,
    resetGame,
    updateDifficulty,
    isAutoPlaying,
    stopAutoPlay,
    updateBetAmount,
  } = useGame();

  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [betInput, setBetInput] = useState(gameConfig.betAmount.toString());
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState(0);


  const lastRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;

  // Trigger spinning animation during auto play
  useEffect(() => {
    if (isAutoPlaying && lastRound) {
      setIsSpinning(true);
      const spinTimer = setTimeout(() => {
        setIsSpinning(false);
      }, 800);
      return () => clearTimeout(spinTimer);
    }
  }, [lastRound?.roundNumber, isAutoPlaying]);

  // Show message when round changes
  useEffect(() => {
    if (lastRound && !isSpinning && !isAutoPlaying) {
      if (lastRound.result === 'win') {
        setMessage(`🎉 VITÓRIA! +${lastRound.payout} fichas!`);
      } else {
        setMessage('😢 Derrota. Tente novamente!');
      }
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastRound?.roundNumber, isSpinning, isAutoPlaying]);

  const handleSpin = async () => {
    if (isSpinning || gameState.isGameOver || isAutoPlaying) return;

    setIsSpinning(true);
    setMessage('');

    // Wait for spinning animation to complete
    await new Promise((resolve) => setTimeout(resolve, 800));

    // THEN generate the result
    playRound();
    
    // Animation ends
    setIsSpinning(false);
  };

  const handleAutoPlayStart = (numberOfRounds: number) => {
    setAutoSpinCount(0);
    // Ensure game is not marked as over before starting auto play
    if (gameState.isGameOver && gameState.gameOverReason !== 'victory') {
      resetGame();
    }
    playAutomatic(numberOfRounds);
  };

  const handleStopAutoPlay = () => {
    stopAutoPlay();
  };

  const handleBetChange = (newBet: number) => {
    const maxBet = gameState.playerBalance;
    const validBet = Math.max(1, Math.min(newBet, maxBet));
    setBetInput(validBet.toString());
    updateBetAmount(validBet);
  };

  const handleBetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBetInput(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      handleBetChange(numValue);
    }
  };

  const expectedValue = calculateExpectedValue(gameConfig.betAmount, gameConfig.difficulty);

  return (
    <div className="w-full space-y-6">
      <AutoPlayModal
        isOpen={showAutoModal}
        onClose={() => setShowAutoModal(false)}
        onConfirm={handleAutoPlayStart}
        maxRounds={1000}
      />

      {/* Main Game Container - Blaze Style */}
      <div className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 rounded-2xl border border-blue-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 border-b border-blue-400/50">
          <h2 className="text-2xl font-bold text-white">🎰 Caça-níqueis Transparente</h2>
          <p className="text-blue-100 text-sm mt-1">Demonstração da Ruína do Jogador</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Balance and Round Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-4 text-center">
              <p className="text-green-300 text-sm font-semibold">SALDO</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{gameState.playerBalance}</p>
              <p className="text-green-200 text-xs mt-1">fichas</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-4 text-center">
              <p className="text-purple-300 text-sm font-semibold">RODADA</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">{gameState.roundNumber}</p>
              <p className="text-purple-200 text-xs mt-1">jogadas</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50 rounded-xl p-4 text-center">
              <p className="text-orange-300 text-sm font-semibold">APOSTA</p>
              <p className="text-3xl font-bold text-orange-400 mt-2">{gameConfig.betAmount}</p>
              <p className="text-orange-200 text-xs mt-1">fichas</p>
            </div>
          </div>

          {/* Bet Control */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-3">Ajuste sua Aposta</p>
            <div className="flex gap-3 items-center">
              <Button
                onClick={() => handleBetChange(gameConfig.betAmount - 10)}
                disabled={isSpinning || gameState.isGameOver || isAutoPlaying || gameConfig.betAmount <= 1}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <input
                type="number"
                value={betInput}
                onChange={handleBetInputChange}
                disabled={isSpinning || gameState.isGameOver || isAutoPlaying}
                className="flex-1 bg-slate-700 text-white text-center font-bold rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
                min="1"
                max={gameState.playerBalance}
              />

              <Button
                onClick={() => handleBetChange(gameConfig.betAmount + 10)}
                disabled={isSpinning || gameState.isGameOver || isAutoPlaying || gameConfig.betAmount >= gameState.playerBalance}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => handleBetChange(gameState.playerBalance)}
                disabled={isSpinning || gameState.isGameOver || isAutoPlaying}
                size="sm"
                variant="outline"
                className="text-white border-blue-500 hover:bg-blue-600/20"
              >
                Máx
              </Button>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-3">Nível de Dificuldade</p>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={gameConfig.difficulty === diff ? 'default' : 'outline'}
                  onClick={() => updateDifficulty(diff)}
                  disabled={gameState.roundNumber > 0 || isSpinning || isAutoPlaying}
                  className={`${
                    gameConfig.difficulty === diff
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'border-slate-600 text-slate-300 hover:border-blue-500'
                  }`}
                >
                  {diff === 'easy' ? '5%' : diff === 'medium' ? '10%' : '15%'}
                </Button>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-3">
              EV: {expectedValue.toFixed(2)} fichas/aposta
            </p>
          </div>

          {/* Slot Machine Display */}
          <div className="bg-gradient-to-b from-yellow-100 to-orange-100 rounded-2xl border-8 border-yellow-500 shadow-2xl p-8" style={{
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div className="flex justify-center gap-6 mb-8">
              {lastRound ? (
                <>
                  <SlotReel symbol={lastRound.symbols[0]} isSpinning={isSpinning} />
                  <SlotReel symbol={lastRound.symbols[1]} isSpinning={isSpinning} />
                  <SlotReel symbol={lastRound.symbols[2]} isSpinning={isSpinning} />
                </>
              ) : (
                <>
                  <SlotReel symbol="cherry" isSpinning={false} />
                  <SlotReel symbol="bar" isSpinning={false} />
                  <SlotReel symbol="bell" isSpinning={false} />
                </>
              )}
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-center text-2xl font-bold mb-6 h-10 ${
                    message.includes('VITÓRIA') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Over Message */}
            {gameState.isGameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-lg p-4 mb-4 flex items-start gap-3 ${
                  gameState.gameOverReason === 'ruin'
                    ? 'bg-red-100 border-2 border-red-500'
                    : 'bg-green-100 border-2 border-green-500'
                }`}
              >
                <AlertCircle className={gameState.gameOverReason === 'ruin' ? 'text-red-600' : 'text-green-600'} />
                <div>
                  <p className={`font-bold ${gameState.gameOverReason === 'ruin' ? 'text-red-700' : 'text-green-700'}`}>
                    {gameState.gameOverReason === 'ruin' ? '💔 Você foi à ruína!' : '🎊 Vitória!'}
                  </p>
                  <p className={`text-sm mt-1 ${gameState.gameOverReason === 'ruin' ? 'text-red-600' : 'text-green-600'}`}>
                    {gameState.gameOverReason === 'ruin'
                      ? 'A Teoria da Ruína do Jogador se confirmou.'
                      : 'Parabéns! Você dobrou seu capital inicial.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                onClick={handleSpin}
                disabled={isSpinning || gameState.isGameOver || isAutoPlaying}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8"
              >
                <Play className="mr-2 w-5 h-5" />
                GIRAR
              </Button>

              <Button
                onClick={resetGame}
                disabled={isAutoPlaying}
                size="lg"
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-500"
              >
                <RotateCcw className="mr-2 w-5 h-5" />
                REINICIAR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
