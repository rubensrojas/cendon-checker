import { db } from './connection';

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Create Players table
db.exec(`
    CREATE TABLE IF NOT EXISTS Players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        tag TEXT NOT NULL UNIQUE
    )
`);

// Create Matches table
db.exec(`
    CREATE TABLE IF NOT EXISTS Matches (
        match_id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )
`);

// Create MatchPlayers table (Join table)
db.exec(`
  CREATE TABLE IF NOT EXISTS MatchPlayers (
      match_id TEXT NOT NULL,
      player_id INTEGER NOT NULL,
      PRIMARY KEY (match_id, player_id),
      FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES Players(id) ON DELETE CASCADE
  )
`);

console.log('Database initialized successfully.');
