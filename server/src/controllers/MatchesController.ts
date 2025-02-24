require('dotenv').config();

import { MatchData } from '../../interfaces/matches';
import { Request, Response } from 'express';

const apiKey = process.env.RIOT_API_KEY;

const fetchPlayerId = async (gameName: string, tagLine: string) => {
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
    const params = Object.entries(options).map(([key, value]) => [key, String(value)]);

    const queryParams = params
      ? '?' +
        new URLSearchParams(params).toString()
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

const getRecentMatches = async (req: Request, res: Response) => {
  try {
    const playerId = await fetchPlayerId(req.body.gameName, req.body.tagLine);

    const matchIds = await fetchMatches(playerId);

    const matchDetails = await fetchMatchDetails(matchIds);

    res.json({
      matches: matchDetails,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch matches', message: err.message });
  }
};

export {
  getRecentMatches,
  fetchPlayerId,
  fetchMatches,
  fetchMatchDetails,
  fetchMatchDetail,
};
