import { GameProvider } from '@/contexts/GameContext';
import { SlotMachine } from '@/components/SlotMachine';
import { StatisticsDashboard } from '@/components/StatisticsDashboard';
import { GameHistory } from '@/components/GameHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APP_TITLE } from '@/const';

export default function Home() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-md border-b border-blue-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 justify-center">
              <span className="text-4xl">🎰</span>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  {APP_TITLE}
                </h1>
                <p className="text-blue-200 text-sm">
                  Demonstração Interativa da Teoria da Ruína do Jogador
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Tabs defaultValue="game" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-slate-800/50 border border-slate-700 rounded-full p-1">
                <TabsTrigger
                  value="game"
                  className="rounded-full px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  🎰 Jogo
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="rounded-full px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  📊 Estatísticas
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-full px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  📜 Histórico
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="game" className="space-y-6">
              <SlotMachine />
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <StatisticsDashboard />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <GameHistory />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-md border-t border-blue-500/30 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center text-blue-200 text-sm space-y-2">
              <p>
                📚 Projeto educativo sobre a <strong>Teoria da Ruína do Jogador</strong> (Gambler's Ruin)
              </p>
              <p className="text-blue-300">
                Desenvolvido com React, Tailwind CSS, Chart.js e Framer Motion
              </p>
              <p className="text-xs text-blue-400 mt-4">
                💡 Dica: Quanto mais você joga, maior a chance de perder tudo!
              </p>
            </div>
          </div>
        </footer>
      </div>
    </GameProvider>
  );
}
