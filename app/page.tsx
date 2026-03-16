import { Header } from "@/components/header";
import { ArticleCard } from "@/components/article-card";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SearchFilters } from "@/components/search-filters";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  let query = db.select().from(articles).orderBy(desc(articles.createdAt));

  const allArticles = await query;
  const categories = [...new Set(allArticles.map((a) => a.category))];

  let filteredArticles = allArticles;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredArticles = filteredArticles.filter((a) =>
      a.title.toLowerCase().includes(searchLower) ||
      a.content.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    filteredArticles = filteredArticles.filter((a) => a.category === category);
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchFilters
          categories={categories}
          currentSearch={search}
          currentCategory={category}
        />

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            没有找到相关文章
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
