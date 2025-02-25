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

  const [refreshCount, setRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMatches = async (
    count: number = 20,
    start: number = 0,
    isLoadingMore = false
  ) => {
    if (isLoadingMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      // First get match IDs for the player using their PUUID
      const matchDetailsResponse = await fetch(
        `${backendUrl}/api/matches/recent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: cendonGameData.gameName,
            tag: cendonGameData.tagLine,
            count: count,
            start: start,
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

      if (isLoadingMore) {
        setMatches([...matches, ...matchDetails.matches]);
      } else {
        setMatches(matchDetails.matches);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (isLoadingMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
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
        gameMode: match.data.gameMode,
      };
    });

    setFilteredMatches(formattedMatches.filter((match) => match !== null));
  };

  const refreshMatches = async () => {
    if (lastRefresh && new Date().getTime() - lastRefresh.getTime() < 20000) {
      return {
        success: false,
        message: 'You can only refresh every 20 seconds',
      };
    }

    setIsRefreshing(true);

    const newMatchesCount = 15;

    try {
      const response = await fetch(`${backendUrl}/api/matches/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cendonGameData.gameName,
          tag: cendonGameData.tagLine,
          count: newMatchesCount,
          start: 0,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
      }

      const responseData = await response.json();
      const newMatches = responseData.matches;

      setMatches([...newMatches, ...matches]);
      setRefreshCount(refreshCount + newMatchesCount);

      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    filterMatches(matches);
  }, [matches]);

  return {
    isLoading,
    filteredMatches,
    error,
    isRefreshing,
    refreshMatches,
    isLoadingMore,
    fetchMatches,
  };
};

export default useRiotDataHook;
