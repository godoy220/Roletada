import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AutoPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rounds: number) => void;
  maxRounds?: number;
}

export function AutoPlayModal({ isOpen, onClose, onConfirm, maxRounds = 1000 }: AutoPlayModalProps) {
  const [selectedRounds, setSelectedRounds] = useState(100);

  const presets = [10, 25, 50, 100, 250, 500];

  const handleConfirm = () => {
    onConfirm(selectedRounds);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 border-2 border-blue-500/50 rounded-2xl shadow-2xl p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">⚡ Modo Automático</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Description */}
              <p className="text-blue-200 text-sm">
                Escolha quantas rodadas automáticas você deseja jogar. O jogo parará automaticamente se você ficar sem saldo ou atingir a meta de vitória.
              </p>

              {/* Preset Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-300">Opções Rápidas:</p>
                <div className="grid grid-cols-3 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSelectedRounds(preset)}
                      className={`py-2 px-3 rounded-lg font-semibold transition ${
                        selectedRounds === preset
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-2 border-blue-400'
                          : 'bg-slate-800 text-blue-300 border-2 border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-300">Quantidade Customizada:</label>
                <input
                  type="number"
                  value={selectedRounds}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(parseInt(e.target.value) || 0, maxRounds));
                    setSelectedRounds(value);
                  }}
                  min="1"
                  max={maxRounds}
                  className="w-full bg-slate-800 text-white text-center text-xl font-bold rounded-lg px-4 py-3 border-2 border-slate-700 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400">Máximo: {maxRounds} rodadas</p>
              </div>

              {/* Display Selected */}
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-300">Você vai jogar</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">{selectedRounds}</p>
                <p className="text-sm text-blue-300 mt-1">rodadas automáticas</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
                >
                  Começar Auto
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
