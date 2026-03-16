import type { Article, NewArticle } from "@/db/schema";

describe("Article Schema", () => {
  describe("类型定义", () => {
    it("可以创建 Article 类型对象", () => {
      const article: Article = {
        id: 1,
        title: "测试标题",
        content: "# 测试内容",
        summary: "测试摘要",
        category: "NLP",
        author: "AI Agent",
        tags: ["tag1", "tag2"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(article.id).toBe(1);
      expect(article.title).toBe("测试标题");
    });

    it("可以创建 NewArticle 类型对象", () => {
      const newArticle: NewArticle = {
        title: "新文章",
        content: "内容",
        summary: "摘要",
        category: "CV",
      };
      expect(newArticle.title).toBe("新文章");
    });
  });
});
