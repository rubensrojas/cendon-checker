import { db } from "../../db/connection";
import { Player } from "../../interfaces/db";
import { MatchData } from "../../interfaces/matches";

const addMatches = async (matches: MatchData[], player: Player) => {
  const checkMatch = db.prepare(
    'SELECT match_id FROM matches WHERE match_id = ?'
  );

  const insert = db.prepare(
    'INSERT INTO matches (match_id, data, game_start_timestamp) VALUES (?, ?, ?)'
  );
  const insertMatchPlayers = db.prepare(
    'INSERT INTO match_players (match_id, game_start_timestamp, player_id, champion, win) VALUES (?, ?, ?, ?, ?)'
  );

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
      }
    }
  }
};


export { addMatches };