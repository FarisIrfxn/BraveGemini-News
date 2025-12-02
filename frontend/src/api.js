const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function fetchArticles(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE_URL}/articles?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}
