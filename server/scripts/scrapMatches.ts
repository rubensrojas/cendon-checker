import { argv, exit } from 'process';
import {
  fetchMatchDetail,
  fetchMatches,
  fetchPlayerPUUID,
} from '../src/controllers/MatchesController';
import { MatchData } from '../interfaces/matches';
import { db } from '../db/connection';
import { Player } from '../interfaces/db';

const scrapMatches = async (
  name: string,
  tag: string,
  initialStart: number = 0,
  totalCount: number = 100
) => {
  let currentMatchCount = 0;

  const playerPUUId = await fetchPlayerPUUID(name, tag);
  const cycles = Math.floor(totalCount / 100) + (totalCount % 100 > 0 ? 1 : 0);

  for (let i = 0; i < cycles; i++) {
    console.log(`Scraping cycle ${i + 1} of ${cycles}`);
    const matchIds = await fetchMatches(playerPUUId, {
      type: 'ranked',
      start: currentMatchCount + initialStart,
      count: totalCount > 100 ? 100 : totalCount,
    });

    console.log(`Fetched ${matchIds.length} matches`);

    const matches = [];

    try {
      for (const matchId of matchIds) {
        if (currentMatchCount === totalCount) {
          break;
        }

        console.log(
          `Fetching match ${matchId} - ${currentMatchCount + 1} of ${totalCount}`
        );

        const matchDetail = await fetchMatchDetail(matchId);

        // Wait 1 second before next request to avoid rate limit
        await new Promise((resolve) => setTimeout(resolve, 1000));

        matches.push(matchDetail);

        currentMatchCount++;
      }
    } catch (error) {
      console.error(`Error scraping matches: ${error}`);
    } finally {
      const player = getPlayerData(name, tag);
      populateMatches(matches, player);
      saveDataIntoJson(matches, name, tag);
    }
  }

  console.log(`Scraping finished`);
};

const populateMatches = (matches: MatchData[], player: Player) => {
  const checkMatch = db.prepare(
    'SELECT match_id FROM matches WHERE match_id = ?'
  );

  const insert = db.prepare(
    'INSERT INTO matches (match_id, data, game_start_timestamp) VALUES (?, ?, ?)'
  );
  const insertMatchPlayers = db.prepare(
    'INSERT INTO match_players (match_id, game_start_timestamp, player_id, champion) VALUES (?, ?, ?, ?)'
  );

  let newMatchCount = 0;

  for (const match of matches) {
    const existingMatch = checkMatch.get(match.metadata.matchId);
    if (!existingMatch) {
      const participantInfo = match.info.participants.find(
        (participant) =>
          participant.riotIdGameName === player.name &&
          participant.riotIdTagline === player.tag
      );

      const championName = participantInfo.championName;
      insert.run(
        match.metadata.matchId,
        JSON.stringify(match.info),
        match.info.gameStartTimestamp
      );
      insertMatchPlayers.run(
        match.metadata.matchId,
        match.info.gameStartTimestamp,
        player.id,
        championName
      );
      newMatchCount++;
    }
  }

  console.log(
    `Populated ${newMatchCount} new matches for player ${player.name} ${player.tag}`
  );
};

const getPlayerData = (name: string, tag: string): Player => {
  const player = db
    .prepare('SELECT * FROM players WHERE name = ? AND tag = ?')
    .get(name, tag);

  if (!player) {
    console.log(`Player ${name}#${tag} not found`);
    throw new Error(`Player ${name}#${tag} not found`);
  }

  return player as Player;
};

const saveDataIntoJson = (matches: any, name: string, tag: string) => {
  const fs = require('fs');
  const path = require('path');

  const outputDir = path.join(__dirname, '..', 'data');
  const timestamp = new Date().getTime();
  const outputFile = path.join(
    outputDir,
    `matches_${name}_${tag}_${timestamp}.json`
  );

  // Create data directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(matches, null, 2));
  console.log(`Matches written to ${outputFile}`);
};

const args = argv.slice(2);

if (args.length === 0) {
  console.log('Please provide arguments');
  exit(1);
}

const playerName = args[0];
const playerTag = args[1];
const initialStart = args[2] ? parseInt(args[2]) : 0;
const totalCount = args[3] ? parseInt(args[3]) : 100;

console.log(
  `Player name: ${playerName} \nPlayer tag: ${playerTag} \nInitial start: ${initialStart} \nTotal count: ${totalCount}`
);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Do you want to continue? (y/n) ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Operation cancelled');
    readline.close();
    exit(0);
  }
  scrapMatches(playerName, playerTag, initialStart, totalCount);

  readline.close();
});
