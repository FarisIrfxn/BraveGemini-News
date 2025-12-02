const axios = require('axios');

async function fetchNews({ query, count = 10, apiKey }) {
  const total = Math.min(parseInt(count, 10) || 10, 50);
  const url = 'https://api.search.brave.com/res/v1/news/search';

  if (!query) {
    throw new Error('Query is required to fetch news');
  }
  if (!apiKey) {
    throw new Error('Brave API key is missing');
  }

  const res = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': apiKey
    },
    params: {
      q: query,
      count: total,
      country: 'US',
      search_lang: 'en',
      spellcheck: 1
    }
  });

  const results = res.data?.results || [];

  return results.map((item) => ({
    title: item.title,
    url: item.url,
    snippet:
      item.description ||
      (item.extra_snippets && item.extra_snippets.join(' ')) ||
      '',
    braveDate: item.published_date || null
  }));
}

module.exports = { fetchNews };
