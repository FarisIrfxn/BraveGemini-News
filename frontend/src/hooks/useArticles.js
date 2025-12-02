import { useCallback, useEffect, useState } from "react";
import { fetchArticles } from "../api";

export function useArticles(initialPage = 1, initialLimit = 10) {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPage = useCallback(
    async (page) => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchArticles(page, pagination.limit);
        setArticles(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError("Something went wrong while fetching articles.");
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  useEffect(() => {
    loadPage(initialPage);
  }, [initialPage, loadPage]);

  return { articles, pagination, loading, error, loadPage };
}
