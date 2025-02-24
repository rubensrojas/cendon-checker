import { db } from "./connection";

const populatePlayers = () => {
  const players = require('./data.json').players;
  const insert = db.prepare('INSERT INTO Players (name, tag) VALUES (?, ?)');
  for (const player of players) {
    insert.run(player.name, player.tag);
  }
};

populatePlayers();