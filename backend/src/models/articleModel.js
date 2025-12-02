const db = require('../db');

function shapeRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    snippet: row.snippet,
    summary: row.summary_ai, // single public field
    highlights: row.highlights_json ? JSON.parse(row.highlights_json) : [],
    category: row.category,
    publishedAt: row.published_at,
    createdAt: row.created_at
  };
}

function listArticles(page = 1, limit = 10) {
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const l = Math.max(parseInt(limit, 10) || 10, 1);

  const total = db.prepare(`SELECT COUNT(*) AS count FROM articles`).get().count;

  const rows = db.prepare(`
    SELECT * FROM articles
    ORDER BY published_at DESC, created_at DESC
    LIMIT ? OFFSET ?
  `).all(l, (p - 1) * l);

  return {
    data: rows.map(shapeRow),
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.max(1, Math.ceil(total / l))
    }
  };
}

function getArticleById(id) {
  const row = db.prepare(`SELECT * FROM articles WHERE id = ?`).get(id);
  return shapeRow(row);
}

function createArticle(payload) {
  const stmt = db.prepare(`
    INSERT INTO articles (title, url, snippet, summary_ai, highlights_json, category, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    payload.title,
    payload.url,
    payload.summary || payload.snippet || '',
    payload.summary || null,
    payload.highlights ? JSON.stringify(payload.highlights) : null,
    payload.category || null,
    payload.publishedAt || null
  );

  return getArticleById(info.lastInsertRowid);
}

function updateArticle(id, payload) {
  const existing = getArticleById(id);
  if (!existing) return null;

  const next = {
    title: payload.title ?? existing.title,
    url: payload.url ?? existing.url,
    snippet: payload.summary ?? payload.snippet ?? existing.snippet,
    summary_ai: payload.summary ?? existing.summaryAi ?? existing.summary,
    highlights_json: payload.highlights
      ? JSON.stringify(payload.highlights)
      : JSON.stringify(existing.highlights || []),
    category: payload.category ?? existing.category,
    published_at: payload.publishedAt ?? existing.publishedAt
  };

  db.prepare(`
    UPDATE articles
    SET title = ?, url = ?, snippet = ?, summary_ai = ?, highlights_json = ?, category = ?, published_at = ?
    WHERE id = ?
  `).run(
    next.title,
    next.url,
    next.snippet,
    next.summary_ai,
    next.highlights_json,
    next.category,
    next.published_at,
    id
  );

  return getArticleById(id);
}

function deleteArticle(id) {
  return db.prepare(`DELETE FROM articles WHERE id = ?`).run(id).changes > 0;
}

function bulkInsertEnriched(articles) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO articles
    (title, url, snippet, summary_ai, highlights_json, category, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((rows) => {
    for (const a of rows) {
      stmt.run(
        a.title,
        a.url,
        a.snippet,
        a.summaryAi,
        a.highlights ? JSON.stringify(a.highlights) : null,
        a.category,
        a.publishedAt
      );
    }
  });

  insertMany(articles);
}

module.exports = {
  listArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  bulkInsertEnriched
};
