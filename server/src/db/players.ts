import { db } from "../../db/connection";
import { Player } from "../../interfaces/db";

const getPlayer = async (name: string, tag: string) => {
  const player = db
    .prepare('SELECT * FROM players WHERE name = ? AND tag = ?')
    .get(name, tag) as Player;

  if (!player) {
    throw new Error('Player not found');
  }

  return player;
};

export { getPlayer };