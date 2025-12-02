const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbFile = process.env.DB_FILE || './data/articles.db';
const dbDir = path.dirname(dbFile);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbFile);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    snippet TEXT,                    -- original snippet from Brave
    summary_ai TEXT,                 -- AI rewritten summary
    highlights_json TEXT,            -- bullet points
    category TEXT,                   -- Technology / Business etc.
    published_at TEXT,               -- improved publishedAt logic
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
