import { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { TrendingDown, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function StatisticsDashboard() {
  const { rounds, gameState } = useGame();

  // Calculate statistics from rounds
  const statistics = useMemo(() => {
    if (rounds.length === 0) {
      return null;
    }

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
  }, [rounds]);

  // Prepare data for balance chart
  const balanceData = useMemo(() => {
    return {
      labels: rounds.map((r) => `R${r.roundNumber}`),
      datasets: [
        {
          label: 'Saldo do Jogador',
          data: rounds.map((r) => r.playerBalanceAfter),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [rounds]);

  // Prepare data for win/loss chart
  const winLossData = useMemo(() => {
    return {
      labels: ['Vitórias', 'Derrotas'],
      datasets: [
        {
          label: 'Quantidade',
          data: [
            statistics?.totalWins || 0,
            statistics?.totalLosses || 0,
          ],
          backgroundColor: ['#10b981', '#ef4444'],
          borderColor: ['#059669', '#dc2626'],
          borderWidth: 2,
        },
      ],
    };
  }, [statistics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Total de Rodadas</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.totalRounds}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Taxa de Vitória</p>
              <p className="text-3xl font-bold text-green-600">
                {(statistics.winRate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.totalWins} vitórias
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Lucro Líquido</p>
              <div className="flex items-center gap-2">
                <p className={`text-3xl font-bold ${statistics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {statistics.netProfit >= 0 ? '+' : ''}{statistics.netProfit}
                </p>
                {statistics.netProfit < 0 ? (
                  <TrendingDown className="text-red-600 w-6 h-6" />
                ) : (
                  <TrendingUp className="text-green-600 w-6 h-6" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">House Edge Médio</p>
              <p className="text-3xl font-bold text-purple-600">
                {(statistics.averageHouseEdge * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução do Saldo</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Demonstra a Ruína do Jogador: saldo tende a zero com o tempo
            </p>
          </CardHeader>
          <CardContent>
            {rounds.length > 0 ? (
              <Line data={balanceData} options={chartOptions} />
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma rodada jogada ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Win/Loss Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vitórias vs Derrotas</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Proporção de resultados nas rodadas jogadas
            </p>
          </CardHeader>
          <CardContent>
            {rounds.length > 0 ? (
              <Bar data={winLossData} options={chartOptions} />
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma rodada jogada ainda</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Message */}
      <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader>
          <CardTitle className="text-base text-yellow-900">📚 Sobre a Ruína do Jogador</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-800 space-y-2">
          <p>
            A <strong>Teoria da Ruína do Jogador</strong> demonstra que, mesmo em jogos justos,
            um jogador com capital finito está quase certo de ficar pobre ao longo do tempo quando
            enfrenta um adversário com recursos muito maiores (a casa).
          </p>
          <p>
            Observe no gráfico acima como o saldo do jogador tende a cair com o tempo, confirmando
            a inevitabilidade matemática da ruína. Este é um dos conceitos mais importantes da
            teoria das probabilidades e da estatística.
          </p>
          <p className="font-semibold">
            💡 Dica: Quanto maior o House Edge, mais rápido o saldo cai!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
