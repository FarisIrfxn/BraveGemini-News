#!/usr/bin/env node
require('dotenv').config();
const { ingestArticles } = require('../services/ingestService');

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function main() {
  const [, , query, count] = process.argv;

  if (!query) {
    console.error('Usage: node ingest.js "query" [count]');
    process.exit(1);
  }

  if (!BRAVE_API_KEY) {
    console.error('Missing BRAVE_API_KEY');
    process.exit(1);
  }

  console.log(`Fetching "${query}" news...`);
  const inserted = await ingestArticles({
    query,
    count,
    braveKey: BRAVE_API_KEY,
    geminiKey: GEMINI_API_KEY,
    concurrency: 4
  });

  console.log(`✔ Done. Inserted ${inserted} articles`);
}

main();
