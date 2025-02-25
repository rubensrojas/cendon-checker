import { argv, exit } from 'process';
import fs from 'fs';
import path from "path";
import { MatchData } from '../interfaces/matches';
import { Player } from '../interfaces/db';
import { db } from '../db/connection';

// Look into the data folder and populate the database with all the json files
const populateDBfromDataJSON = (name: string, tag: string) => {
  const dataFolder = path.join(__dirname, '..', 'data');
  console.log(dataFolder);
  const files = fs.readdirSync(dataFolder);
  console.log(files);

  const player = getPlayerData(name, tag);

  for (const file of files) {
    const filePath = path.join(dataFolder, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const matches = JSON.parse(fileContent);

    populateMatches(matches, player);
  }
};

 const populateMatches = (matches: MatchData[], player: Player) => {
  const checkMatch = db.prepare(
    'SELECT match_id FROM matches WHERE match_id = ?'
  );

  const insert = db.prepare(
    'INSERT INTO matches (match_id, data, game_start_timestamp) VALUES (?, ?, ?)'
  );
  const insertMatchPlayers = db.prepare(
    'INSERT INTO match_players (match_id, game_start_timestamp, player_id, champion, win) VALUES (?, ?, ?, ?, ?)'
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

      if (participantInfo) {
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
          championName,
          participantInfo.win ? 1 : 0
        );
        newMatchCount++;
      }
    }
  }
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


const args = argv.slice(2);

if (args.length === 0) {
  console.log('Please provide arguments');
  exit(1);
}

const playerName = args[0];
const playerTag = args[1];

console.log(
  `Player name: ${playerName} \nPlayer tag: ${playerTag}`
);

populateDBfromDataJSON(playerName, playerTag);
