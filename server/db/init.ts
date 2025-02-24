import { db } from './connection';

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Create Players table
db.exec(`
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        tag TEXT NOT NULL,
        UNIQUE(name, tag)
    )
`);

// Create Matches table
db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
        match_id TEXT PRIMARY KEY,
        game_start_timestamp INTEGER NOT NULL,
        data TEXT NOT NULL
    )
`);

// Create MatchPlayers table (Join table)
db.exec(`
    CREATE TABLE IF NOT EXISTS match_players (
        match_id TEXT NOT NULL,
        game_start_timestamp INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        champion STRING NOT NULL,
        PRIMARY KEY (match_id, player_id),
        FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES Players(id) ON DELETE CASCADE
    )
`);

console.log('Database initialized successfully.');
