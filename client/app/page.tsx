'use client';

import Loading from '@/components/Loading';
import GameRow from '../components/GameRow';
import useMatches from '@/hooks/useMatches';
import StatisticsCard from '@/components/StatisticsCard';
import useStatistics from '@/hooks/useStatistics';

export default function HomePage() {
  const { isLoading, filteredMatches: games, error } = useMatches();
  const { isLoading: isLoadingStatistics, winRate, last24Hours, lastWeek, lastMonth, mostPlayedChampion } = useStatistics(games);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-lg w-full mx-4">
          <p className="text-red-500 text-xl font-bold text-center">Error</p>
          <p className="text-gray-400 text-center mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="flex flex-col px-4 py-6 gap-4 max-w-lg mx-auto">
        <StatisticsCard
          winRate={winRate}
          last24Hours={last24Hours}
          lastWeek={lastWeek}
          lastMonth={lastMonth}
          mostPlayedChampion={mostPlayedChampion}
          isLoading={isLoadingStatistics}
        />
        <h6 className="text-xl text-center font-bold">
          Últimos {games.length} jogos ranqueados
        </h6>
        {games.map((game) => (
          <GameRow key={game.id} {...game} />
        ))}
      </div>
    </main>
  );
}
