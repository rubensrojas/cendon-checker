import Database from 'better-sqlite3';
import path from 'path';

// Initialize the database connection
const dbPath = path.join(__dirname, '..', 'database.db');
export const db = new Database(dbPath, { verbose: console.log });