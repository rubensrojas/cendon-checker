require('dotenv').config();

import { db } from '../../db/connection';
import { Match, MatchPlayer } from '../../interfaces/db';
import { MatchData, MatchInfo } from '../../interfaces/matches';
import { Request, Response } from 'express';
import { getPlayer } from '../db/players';
import { addMatches } from '../db/matches';

const apiKey = process.env.RIOT_API_KEY;

const fetchPlayerPUUID = async (gameName: string, tagLine: string) => {
  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        headers: {
          'X-Riot-Token': apiKey,
        },
      }
    );

    const data = await response.json();

    return data.puuid;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch player ID: ${err}`);
  }
};

const fetchMatches = async (
  playerId: string,
  options: { [key: string]: string | number } = {}
) => {
  try {
    const params = Object.entries(options).map(([key, value]) => [
      key,
      String(value),
    ]);

    const queryParams = params
      ? '?' + new URLSearchParams(params).toString()
      : '';

    const matchIdsResponse = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${playerId}/ids${queryParams}`,
      {
        method: 'GET',
        headers: {
          'X-Riot-Token': apiKey,
        },
      }
    );

    if (!matchIdsResponse.ok) {
      const response = await matchIdsResponse.json();

      const errorMessage = response.status.message;

      throw new Error(`Failed to fetch match IDs: ${errorMessage}`);
    }

    const matchIds = await matchIdsResponse.json();

    return matchIds;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch matches: ${err}`);
  }
};

const fetchMatchDetail = async (matchId: string) => {
  const matchResponse = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    {
      headers: {
        'X-Riot-Token': apiKey,
      },
    }
  );

  if (!matchResponse.ok) {
    const response = await matchResponse.json();
    console.error(response);
    throw new Error(
      `Failed to fetch match details: ${response.status.message}`
    );
  }

  const matchData: MatchData = await matchResponse.json();

  return matchData;
};

const fetchMatchDetails = async (matchIds: string[]) => {
  const matchDetailsPromises = matchIds.map(
    async (matchId: string): Promise<MatchData> => {
      const matchData = await fetchMatchDetail(matchId);
      return matchData;
    }
  );
  const matchDetails = await Promise.all(matchDetailsPromises);
  return matchDetails;
};

const getLastedMatches = async (
  playerId: number,
  count: number = 20,
  start: number = 0
) => {
  const playerMatches = db
    .prepare(
      'SELECT * FROM match_players where player_id = ? ORDER BY game_start_timestamp DESC LIMIT ? OFFSET ?'
    )
    .all(playerId, count, start) as MatchPlayer[];

  const matchesDetails: { matchId: string; data: MatchInfo }[] = [];

  for (const playerMatch of playerMatches) {
    const matchId = playerMatch.match_id;
    const match = db
      .prepare('SELECT * FROM matches WHERE match_id = ?')
      .get(matchId) as Match;

    const matchInfo = { matchId: match.match_id, data: JSON.parse(match.data) };
    matchesDetails.push(matchInfo);
  }

  return matchesDetails;
};

const getRecentMatches = async (
  req: Request & {
    body: { name?: string; tag?: string; count?: number; start?: number };
  },
  res: Response
) => {
  const name = req?.body?.name;
  const tag = req?.body?.tag;
  const count = isNaN(Number(req?.body?.count)) ? 20 : Number(req?.body?.count);
  const start = isNaN(Number(req?.body?.start)) ? 0 : Number(req?.body?.start);

  if (!name || !tag) {
    res.status(400).json({ error: 'Name and Tag are required' });
    return;
  }

  try {
    const { id: playerId } = await getPlayer(name, tag);

    const matches = await getLastedMatches(playerId, count, start);

    res.json({
      matches: matches,
      message: 'Success',
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Failed to fetch matches', message: err.message });
  }
};

const filterExistingMatches = (matches: string[]) => {
  const checkMatch = db.prepare(
    'SELECT match_id FROM matches WHERE match_id = ?'
  );

  const newMatches: string[] = [];

  for (const match of matches) {
    const existingMatch = checkMatch.get(match);
    if (!existingMatch) {
      newMatches.push(match);
    }
  }

  console.log(newMatches);

  return newMatches;
};

const refreshMatches = async (req: Request, res: Response) => {
  const name = req?.body?.name;
  const tag = req?.body?.tag;
  const count = isNaN(Number(req?.body?.count)) ? 10 : Number(req?.body?.count);
  const start = isNaN(Number(req?.body?.start)) ? 0 : Number(req?.body?.start);

  if (!name || !tag) {
    res.status(400).json({ error: 'Name and Tag are required' });
    return;
  }

  try {
    const playerPUUID = await fetchPlayerPUUID(name, tag);

    const matches = await fetchMatches(playerPUUID, {
      count,
      start,
    });

    const newMatchesIds = filterExistingMatches(matches);

    if (newMatchesIds.length === 0) {
      res.json({
        matches: [],
        message: 'No new matches found',
      });
      return;
    }

    const matchesDetails = await fetchMatchDetails(newMatchesIds);

    const player = await getPlayer(name, tag);
    await addMatches(matchesDetails, player);

    const newMatches = await getLastedMatches(player.id, newMatchesIds.length);

    res.json({
      matches: newMatches,
      message: 'Success',
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Failed to fetch player ID', message: err.message });
  }
};

export {
  getRecentMatches,
  fetchPlayerPUUID,
  fetchMatches,
  fetchMatchDetails,
  fetchMatchDetail,
  refreshMatches,
};
