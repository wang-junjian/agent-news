import { setupTestDb, teardownTestDb, createTestArticle } from "./test-utils";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

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
});
