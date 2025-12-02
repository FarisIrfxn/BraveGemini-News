const axios = require('axios');
const { jsonrepair } = require('jsonrepair');

async function summarizeWithGemini(article, apiKey) {
  if (!apiKey) {
    return {
      summaryAi: article.snippet?.slice(0, 250) || '',
      highlights: [],
      category: 'Other',
      aiDate: null
    };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are a news summarization AI.

Given the article title, snippet, and URL below:
- Write ONE concise summary sentence.
- Provide 3–5 bullet "highlights".
- Infer a broad category (e.g. Technology, Business, Politics, Sports).
- If you can detect a publication date from the title, snippet, or URL, return it as "date" in ISO 8601. If unsure, set "date": null.
Respond with ONLY JSON.

TITLE:
"""${article.title || ''}"""

SNIPPET:
"""${article.snippet || ''}"""

URL:
"""${article.url || ''}"""

Return JSON:
{
  "summary": "string",
  "highlights": ["string"],
  "category": "Technology",
  "date": "2025-11-25"
}
`.trim();

  try {
    const res = await axios.post(endpoint, {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    });

    let raw = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    raw = jsonrepair(raw);

    const parsed = JSON.parse(raw);

    return {
      summaryAi: parsed.summary || article.snippet?.slice(0, 250) || '',
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
      category: parsed.category || 'Other',
      aiDate: parsed.date || null
    };
  } catch (err) {
    return {
      summaryAi: article.snippet?.slice(0, 250) || '',
      highlights: [],
      category: 'Other',
      aiDate: null
    };
  }
}

module.exports = { summarizeWithGemini };
