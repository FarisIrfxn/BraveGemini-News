# BraveGemini-News
Brave and Gemini powered news ingestor + Express CRUD API + React frontend.

## Stack
- Node.js + Express + better-sqlite3 for a simple file-based DB.
- Ingestion script pulls Brave Search News and enriches with Gemini summaries.
- React (Vite) frontend renders paginated articles.

## Getting Started

### Backend
```
cd backend
cp .env.example .env
# edit .env with your Brave/Gemini keys
npm install
npm run dev
```

`backend/.env.example` contains sane defaults (port, DB file, CORS origin) plus placeholders for `BRAVE_API_KEY` and `GEMINI_API_KEY`. Copy it once (`cp backend/.env.example backend/.env`) and fill in the keys before starting the server or running ingestion.

### Ingest articles
```
cd backend
node src/scripts/ingest.js "ai news" 10
```
Uses Brave + Gemini by default; falls back to snippet-only summaries if Gemini key is absent.

### Frontend
```
cd frontend
npm install
npm run dev
```
Set `VITE_API_BASE_URL=http://localhost:4000` in `frontend/.env` if you run the API on a different host.

## API
- `GET /articles?page=1&limit=10` → `{ data, pagination }`
- `GET /articles/:id`
- `POST /articles` body: `{ title, url, summary?, highlights?, category?, publishedAt? }`
- `PUT /articles/:id` body: partial same as POST
- `DELETE /articles/:id`

Responses include: `id, title, url, snippet, summary, highlights, category, publishedAt, createdAt`.

## Architecture Notes
- SQLite via better-sqlite3 keeps setup zero-friction; schema lives in `backend/src/db.js` and initializes on startup.
- Layering: routes → controllers → models (`src/routes`, `src/controllers`, `src/models`). External calls live in `src/services` (Brave, Gemini, ingest orchestrator).
- Ingestion script is a thin CLI wrapper around `ingestService`; it fetches Brave news, AI-summarizes (with safe fallback), then bulk inserts with `INSERT OR IGNORE` to avoid URL duplicates.
- Frontend uses a small `useArticles` hook for pagination/data fetching, plus presentational components (`ArticleList`, `ArticleCard`, `Pagination`). Pagination hides itself when only one page exists.

## Project Structure (high level)
```
backend/src
  app.js | server.js | db.js
  routes/articleRoutes.js
  controllers/articleController.js
  models/articleModel.js
  services/{braveService, aiService, ingestService}.js
  scripts/ingest.js
frontend/src
  api.js
  hooks/useArticles.js
  components/{ArticleList, ArticleCard, Pagination}.jsx
  App.jsx | main.jsx
```
