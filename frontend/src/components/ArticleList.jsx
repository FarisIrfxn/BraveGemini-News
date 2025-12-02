import ArticleCard from "./ArticleCard";

export default function ArticleList({ articles }) {
  if (!articles.length) {
    return (
      <p className="text-center text-gray-500">No articles available.</p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
