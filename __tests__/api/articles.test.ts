import { setupTestDb, teardownTestDb, createTestArticle } from "./test-utils";
import { articles } from "@/db/schema";
import { eq, desc, like, or, and } from "drizzle-orm";

describe("Articles API (Database Tests)", () => {
  let sqlite: any;
  let testDb: any;

  beforeEach(() => {
    const setup = setupTestDb();
    sqlite = setup.sqlite;
    testDb = setup.db;
  });

  afterEach(() => {
    teardownTestDb(sqlite);
  });

  describe("Database Operations", () => {
    it("创建文章", async () => {
      const article = createTestArticle();
      const [result] = await testDb.insert(articles).values(article).returning();

      expect(result.id).toBeDefined();
      expect(result.title).toBe(article.title);
    });

    it("查询文章列表", async () => {
      await testDb.insert(articles).values([
        createTestArticle({ title: "Article 1" }),
        createTestArticle({ title: "Article 2" }),
      ]);

      const results = await testDb.select().from(articles);
      expect(results.length).toBe(2);
    });

    it("按 ID 查询文章", async () => {
      const [created] = await testDb
        .insert(articles)
        .values(createTestArticle())
        .returning();

      const [found] = await testDb
        .select()
        .from(articles)
        .where(eq(articles.id, created.id));

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
    });

    it("更新文章", async () => {
      const [created] = await testDb
        .insert(articles)
        .values(createTestArticle({ title: "Original Title" }))
        .returning();

      const [updated] = await testDb
        .update(articles)
        .set({ title: "Updated Title", updatedAt: new Date() })
        .where(eq(articles.id, created.id))
        .returning();

      expect(updated.title).toBe("Updated Title");
    });

    it("删除文章", async () => {
      const [created] = await testDb
        .insert(articles)
        .values(createTestArticle())
        .returning();

      await testDb.delete(articles).where(eq(articles.id, created.id));

      const results = await testDb.select().from(articles);
      expect(results.length).toBe(0);
    });
  });

  describe("搜索功能", () => {
    beforeEach(async () => {
      await testDb.insert(articles).values([
        createTestArticle({
          title: "大语言模型入门指南",
          content: "# 大语言模型\n\n本文介绍大语言模型的基本概念和使用方法",
          category: "NLP",
        }),
        createTestArticle({
          title: "计算机视觉综述",
          content: "# CV 技术\n\n探索计算机视觉在各个领域的应用",
          category: "CV",
        }),
        createTestArticle({
          title: "Agent 工作流最佳实践",
          content: "# Agentic Workflow\n\n如何构建高效的 Agent 工作流系统",
          category: "Agentic Workflow",
        }),
      ]);
    });

    it("按标题搜索", async () => {
      const results = await testDb
        .select()
        .from(articles)
        .where(like(articles.title, "%语言%"))
        .orderBy(desc(articles.createdAt));

      expect(results.length).toBe(1);
      expect(results[0].title).toContain("语言");
    });

    it("按内容搜索", async () => {
      const results = await testDb
        .select()
        .from(articles)
        .where(like(articles.content, "%Agent%"))
        .orderBy(desc(articles.createdAt));

      expect(results.length).toBe(1);
      expect(results[0].title).toContain("Agent");
    });

    it("同时搜索标题和内容（OR 查询）", async () => {
      const results = await testDb
        .select()
        .from(articles)
        .where(or(
          like(articles.title, "%模型%"),
          like(articles.content, "%模型%")
        ))
        .orderBy(desc(articles.createdAt));

      expect(results.length).toBe(1);
      expect(results[0].title).toBe("大语言模型入门指南");
    });

    it("按分类过滤", async () => {
      const results = await testDb
        .select()
        .from(articles)
        .where(eq(articles.category, "CV"))
        .orderBy(desc(articles.createdAt));

      expect(results.length).toBe(1);
      expect(results[0].category).toBe("CV");
    });

    it("组合搜索：关键词 + 分类", async () => {
      const results = await testDb
        .select()
        .from(articles)
        .where(
          and(
            or(
              like(articles.title, "%工作流%"),
              like(articles.content, "%工作流%")
            ),
            eq(articles.category, "Agentic Workflow")
          )
        )
        .orderBy(desc(articles.createdAt));

      expect(results.length).toBe(1);
      expect(results[0].title).toContain("工作流");
      expect(results[0].category).toBe("Agentic Workflow");
    });

    it("搜索不匹配返回空结果", async () => {
      const results = await testDb
        .select()
        .from(articles)
        .where(or(
          like(articles.title, "%不存在的关键词%"),
          like(articles.content, "%不存在的关键词%")
        ));

      expect(results.length).toBe(0);
    });
  });
});
