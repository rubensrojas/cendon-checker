'use client';

import Loading from '@/components/Loading';
import GameRow from '../components/GameRow';
import useMatches from '@/hooks/useMatches';

export default function HomePage() {
  const { isLoading, filteredMatches: games, winRate } = useMatches();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <div className="flex flex-col px-4 py-6 gap-4 max-w-lg mx-auto">
        <div className="flex flex-row justify-between items-center bg-foreground rounded-lg p-4 border border-white/5">
          <div className="flex flex-col gap-2 justify-evenly">
            <div className="font-bold">Hoje: 7 jogos</div>
            <div className="font-bold">Semana: 35 jogos</div>
            <div className="font-bold">Mês: 100 jogos</div>
          </div>
          <div className="relative overflow-hidden h-[80px] w-[80px] rounded-full flex items-center justify-center">
            <div
              className={
                'absolute h-[80px] w-[80px] ' +
                (winRate > 50 ? 'bg-green-500' : 'bg-red-500')
              }
              style={{
                transform: `translateY(${100 - winRate}%)`,
              }}
            ></div>
            <div className="absolute h-[76px] w-[76px] rounded-full bg-foreground"></div>
            <div className="text-lg font-bold z-10">{winRate}%</div>
          </div>
        </div>
        <div className="text-xl text-center font-bold">
          Últimos {games.length} jogos
        </div>
        {games.map((game) => (
          <GameRow key={game.id} {...game} />
        ))}
      </div>
    </main>
  );
}
