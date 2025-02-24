import { cendonGameData } from '@/constants';
import { FormattedMatch } from '@/interfaces/matches';
import { useState, useEffect } from 'react';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const useStatistics = (matches: FormattedMatch[]) => {
  const [winRate, setWinRate] = useState<number>(0);
  const [last24Hours, setLast24Hours] = useState<number>(0);
  const [lastWeek, setLastWeek] = useState<number>(0);
  const [lastMonth, setLastMonth] = useState<number>(0);
  const [mostPlayedChampion, setMostPlayedChampion] = useState<{
    champion: string;
    count: number;
  }>({
    champion: '',
    count: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const calculateWinRate = (matches: FormattedMatch[]) => {
    const wins = matches.filter((match) => match.win).length;
    const losses = matches.filter((match) => !match.win).length;
    return (wins / (wins + losses)) * 100;
  };

  const getStatistics = async (player: {
    gameName: string;
    tagLine: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/statistics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: player.gameName,
            tag: player.tagLine,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();

      setLast24Hours(data.gamesCount.last24Hours);
      setLastWeek(data.gamesCount.lastWeek);
      setLastMonth(data.gamesCount.lastMonth);
      setMostPlayedChampion(data.mostPlayedChampion);
    } catch (error) {
      console.error(error);
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setWinRate(calculateWinRate(matches));
  }, [matches]);

  useEffect(() => {
    getStatistics(cendonGameData);
  }, []);

  return {
    error,
    isLoading,
    winRate,
    last24Hours,
    lastWeek,
    lastMonth,
    mostPlayedChampion,
  };
};

export default useStatistics;
