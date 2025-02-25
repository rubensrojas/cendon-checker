import { Request, Response } from 'express';
import { db } from '../../db/connection';
import { getPlayerId } from './MatchesController';
import { MatchPlayer } from '../../interfaces/db';

const getLastMatches = async (
  playerId: number,
  count: number = 500,
  start: number = 0
) => {
  const matches = db
    .prepare(
      'SELECT * FROM match_players WHERE player_id = ? ORDER BY game_start_timestamp DESC LIMIT ? OFFSET ?'
    )
    .all(playerId, count, start) as MatchPlayer[];
      
  return matches;
};

const getMostPlayedChampion = async (playerId: number) => {
  const champion = db
    .prepare(
      'SELECT champion, COUNT(*) as count FROM match_players WHERE player_id = ? GROUP BY champion ORDER BY count DESC LIMIT 1'
    )
    .get(playerId);
  return champion;
};

const formatMatchesByDate = (matches: MatchPlayer[]) => {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    last24Hours: matches.filter(match => {
      const matchDate = new Date(match.game_start_timestamp);
      return matchDate >= new Date(today.getTime() - 24 * 60 * 60 * 1000);
    }),
    lastWeek: matches.filter(match => {
      const matchDate = new Date(match.game_start_timestamp);
      return matchDate >= oneWeekAgo;
    }),
    lastMonth: matches.filter(match => {
      const matchDate = new Date(match.game_start_timestamp);
      return matchDate >= oneMonthAgo;
    })
  };
};

const calculateWinRate = (matches: MatchPlayer[]) => {
  const wins = matches.filter((match) => match.win).length;
  const losses = matches.filter((match) => !match.win).length;
  return (wins / (wins + losses)) * 100;
};

const getStatistics = async (
  req: Request & {
    body: { name?: string; tag?: string };
  },
  res: Response
) => {
  const name = req?.body?.name;
  const tag = req?.body?.tag;

  if (!name || !tag) {
    res.status(400).json({ error: 'Name and Tag are required' });
    return;
  }

  try {
    const playerId = await getPlayerId(name, tag);

    const lastMatches = await getLastMatches(playerId);
    const matchesByDate = formatMatchesByDate(lastMatches);
    const mostPlayedChampion = await getMostPlayedChampion(playerId);

    const winRate = calculateWinRate(lastMatches);

    res.status(200).json({
      gamesCount: {
        last24Hours: matchesByDate.last24Hours.length,
        lastWeek: matchesByDate.lastWeek.length,
        lastMonth: matchesByDate.lastMonth.length,
      },
      mostPlayedChampion,
      winRate,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch statistics', message: err.message });
  }
};

export { getStatistics };
