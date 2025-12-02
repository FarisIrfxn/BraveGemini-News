process.env.DB_FILE = ':memory:';
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const { createArticle } = require('../src/models/articleModel');

describe('Articles API', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM articles').run();
    createArticle({
      title: 'Test Article',
      url: 'https://example.com/test',
      summary: 'Test summary',
      publishedAt: null
    });
  });

  it('GET /articles returns paginated list', async () => {
    const res = await request(app).get('/articles?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /articles creates an article', async () => {
    const res = await request(app)
      .post('/articles')
      .send({
        title: 'Another Test Article',
        url: 'https://example.com/test2',
        summary: 'Another summary',
        publishedAt: '2025-01-01T00:00:00Z'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
