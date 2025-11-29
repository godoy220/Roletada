import { motion } from 'framer-motion';
import { Symbol } from '@/lib/gameLogic';

const SYMBOL_EMOJIS: Record<Symbol, string> = {
  cherry: '🍒',
  bar: '🍫',
  bell: '🔔',
  seven: '7️⃣',
};

const SYMBOL_NAMES: Record<Symbol, string> = {
  cherry: 'Cereja',
  bar: 'Bar',
  bell: 'Sino',
  seven: 'Sete',
};

interface SlotReelProps {
  symbol: Symbol;
  isSpinning: boolean;
}

export function SlotReel({ symbol, isSpinning }: SlotReelProps) {
  return (
    <div className="relative w-32 h-40">
      {/* Outer Gold Frame - 3D Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.5)'
        }}>
      </div>

      {/* Inner Border - Dark Frame */}
      <div className="absolute inset-2 bg-gradient-to-b from-amber-900 to-yellow-900 rounded-xl border-4 border-amber-800 shadow-inner">
      </div>

      {/* Display Area - White Background with Perspective */}
      <div className="absolute inset-4 bg-gradient-to-b from-white to-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-inner"
        style={{ perspective: '1000px' }}>
        
        {/* Spinning Container - Rotates on X axis (vertical) */}
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={
            isSpinning
              ? {
                  rotateX: [0, -360, -720, -1080],
                }
              : {
                  rotateX: 0,
                }
          }
          transition={{
            duration: isSpinning ? 0.8 : 0.3,
            ease: isSpinning ? 'easeOut' : 'easeInOut',
          }}
          style={{ 
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-6xl font-bold">{SYMBOL_EMOJIS[symbol]}</span>
            <span className="text-xs font-bold text-gray-700 text-center px-1">{SYMBOL_NAMES[symbol]}</span>
          </div>
        </motion.div>
      </div>

      {/* Top Shine Effect */}
      <div className="absolute top-1 left-3 right-3 h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-40 pointer-events-none"></div>

      {/* Bottom Shadow Effect */}
      <div className="absolute bottom-1 left-3 right-3 h-1 bg-gradient-to-r from-transparent via-black to-transparent rounded-full opacity-20 pointer-events-none"></div>
    </div>
  );
}
