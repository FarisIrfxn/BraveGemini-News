import ArticleList from "./components/ArticleList";
import Pagination from "./components/Pagination";
import { useArticles } from "./hooks/useArticles";

export default function App() {
  const { articles, pagination, loading, error, loadPage } = useArticles(1, 10);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          📰 Auralys News
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Latest news fetched using Brave Search API
        </p>

        {loading && (
          <p className="text-center text-xl text-gray-600">Loading articles...</p>
        )}

        {error && (
          <div className="text-center space-y-2">
            <p className="text-red-500 text-lg font-semibold">{error}</p>
            <button
              onClick={() => loadPage(pagination.page)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <ArticleList articles={articles} />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={loadPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
