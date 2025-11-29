import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { Symbol } from '@/lib/gameLogic';
import { ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';

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

export function GameHistory() {
  const { rounds } = useGame();
  const [expanded, setExpanded] = useState(false);

  // Sort rounds by roundNumber in descending order (most recent first)
  const sortedRounds = useMemo(() => {
    return [...rounds].sort((a, b) => b.roundNumber - a.roundNumber);
  }, [rounds]);

  const displayedRounds = useMemo(() => {
    return expanded ? sortedRounds : sortedRounds.slice(0, 10);
  }, [sortedRounds, expanded]);

  if (rounds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Jogadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">Nenhuma rodada jogada ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Jogadas</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Total: {rounds.length} rodadas (mostrando {Math.min(displayedRounds.length, 10)} mais recentes)
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Rodada</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Símbolos</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Aposta</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Resultado</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Payout</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">Saldo Final</th>
              </tr>
            </thead>
            <tbody>
              {displayedRounds.map((round, idx) => (
                <tr
                  key={`${round.roundNumber}-${idx}`}
                  className={`border-b border-gray-100 transition-colors ${
                    round.result === 'win' ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <td className="py-3 px-3 font-semibold text-gray-800">#{round.roundNumber}</td>
                  <td className="py-3 px-3 text-lg">
                    <span title={`${SYMBOL_NAMES[round.symbols[0]]} + ${SYMBOL_NAMES[round.symbols[1]]} + ${SYMBOL_NAMES[round.symbols[2]]}`}>
                      {SYMBOL_EMOJIS[round.symbols[0]]}
                      {SYMBOL_EMOJIS[round.symbols[1]]}
                      {SYMBOL_EMOJIS[round.symbols[2]]}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-700 font-semibold">{round.bet}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                        round.result === 'win'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {round.result === 'win' ? '✓ Ganhou' : '✗ Perdeu'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-gray-800">
                    {round.payout > 0 ? (
                      <span className="text-green-600">+{round.payout}</span>
                    ) : (
                      <span className="text-red-600">0</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900">
                    {round.playerBalanceAfter}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!expanded && rounds.length > 10 && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full mt-4 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg flex items-center justify-center gap-2 transition"
          >
            <ChevronDown className="w-4 h-4" />
            Mostrar todas as {rounds.length} rodadas
          </button>
        )}

        {expanded && rounds.length > 10 && (
          <button
            onClick={() => setExpanded(false)}
            className="w-full mt-4 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-lg flex items-center justify-center gap-2 transition"
          >
            <ChevronDown className="w-4 h-4 rotate-180" />
            Recolher
          </button>
        )}
      </CardContent>
    </Card>
  );
}
