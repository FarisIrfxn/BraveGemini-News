export default function ArticleCard({ article }) {
  const displaySummary = article.summaryAi || article.summary || article.snippet || "";

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {article.title}
        </h3>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {article.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {article.category}
            </span>
          )}
        </div>

        {displaySummary && (
          <p className="text-gray-600 mb-3">
            {displaySummary}
          </p>
        )}

        {article.highlights && article.highlights.length > 0 && (
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
            {article.highlights.map((h, idx) => (
              <li key={idx}>{h}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          Read Article →
        </a>

        {article.publishedAt && (
          <span className="text-xs text-gray-500">
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
