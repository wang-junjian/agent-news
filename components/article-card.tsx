import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import type { Article } from "@/db/schema";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-xl leading-tight">
              {article.title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {article.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 line-clamp-3 mb-4">
            {article.summary}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(article.createdAt).toLocaleDateString("zh-CN")}
              </span>
            </div>
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
