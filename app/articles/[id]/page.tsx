import { Header } from "@/components/header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, parseInt(id)));

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              {article.tags && article.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  创建于 {new Date(article.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              {article.updatedAt > article.createdAt && (
                <div className="text-sm">
                  更新于 {new Date(article.updatedAt).toLocaleDateString("zh-CN")}
                </div>
              )}
            </div>
          </header>

          <section className="text-lg text-gray-700 mb-8 border-l-4 border-gray-300 pl-4 bg-gray-50 py-4 pr-4 rounded-r-lg">
            {article.summary}
          </section>

          <section className="border-t pt-8">
            <MarkdownRenderer content={article.content} />
          </section>
        </article>
      </main>
    </div>
  );
}
