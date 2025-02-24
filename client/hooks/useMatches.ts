import { useState, useEffect } from 'react';
import { cendonGameData } from '../constants';
import { FormattedMatch, MatchInfo } from '../interfaces/matches';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const useRiotDataHook = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<
    {
      matchId: string;
      data: MatchInfo;
    }[]
  >([]);
  const [filteredMatches, setFilteredMatches] = useState<FormattedMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [winRate, setWinRate] = useState<number>(0);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      // First get match IDs for the player using their PUUID
      const matchDetailsResponse = await fetch(
        `${backendUrl}/api/recent-matches`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: cendonGameData.gameName,
            tag: cendonGameData.tagLine,
            count: 20,
            start: 0,
          }),
        }
      );

      if (!matchDetailsResponse.ok) {
        const errorResponse = await matchDetailsResponse.json();
        throw new Error(errorResponse.error);
      }

      const matchDetails: {
        matches: {
          matchId: string;
          data: MatchInfo;
        }[];
      } = await matchDetailsResponse.json();

      setMatches(matchDetails.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMatches = (matches: { matchId: string; data: MatchInfo }[]) => {
    const formattedMatches = matches.map((match) => {
      const participantData = match.data.participants.find(
        (participant) =>
          participant.riotIdGameName === cendonGameData.gameName &&
          participant.riotIdTagline === cendonGameData.tagLine
      );

      if (!participantData) return null;

      return {
        id: match.matchId,
        date: match.data.gameStartTimestamp,
        win: participantData.win,
        champion: participantData.championName,
        kills: participantData.kills,
        deaths: participantData.deaths,
        assists: participantData.assists,
        damage: participantData.totalDamageDealtToChampions,
        gold: participantData.goldEarned,
        gameLength: match.data.gameDuration,
      };
    });

    setFilteredMatches(formattedMatches.filter((match) => match !== null));
  };

  const calculateWinRate = (matches: FormattedMatch[]) => {
    const wins = matches.filter((match) => match.win).length;
    const losses = matches.filter((match) => !match.win).length;
    return (wins / (wins + losses)) * 100;
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    filterMatches(matches);
  }, [matches]);

  useEffect(() => {
    setWinRate(calculateWinRate(filteredMatches));
  }, [filteredMatches]);

  return { isLoading, filteredMatches, error, winRate };
};

export default useRiotDataHook;
