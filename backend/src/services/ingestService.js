const { fetchNews } = require('./braveService');
const { summarizeWithGemini } = require('./aiService');
const { bulkInsertEnriched } = require('../models/articleModel');

async function mapWithLimit(items, limit, iteratee) {
  const results = new Array(items.length);
  let idx = 0;

  const workers = Array(Math.min(limit, items.length))
    .fill(null)
    .map(async () => {
      while (true) {
        const current = idx;
        idx += 1;
        if (current >= items.length) return;
        results[current] = await iteratee(items[current], current);
      }
    });

  await Promise.all(workers);
  return results;
}

async function ingestArticles({ query, count = 10, braveKey, geminiKey, concurrency = 4 }) {
  const fetched = await fetchNews({ query, count, apiKey: braveKey });

  const enriched = await mapWithLimit(fetched, concurrency, async (article) => {
    const ai = await summarizeWithGemini(article, geminiKey);
    const publishedAt = article.braveDate || ai.aiDate || null;

    return {
      title: article.title,
      url: article.url,
      snippet: article.snippet,
      summaryAi: ai.summaryAi,
      highlights: ai.highlights,
      category: ai.category,
      publishedAt
    };
  });

  bulkInsertEnriched(enriched);
  return enriched.length;
}

module.exports = { ingestArticles };
