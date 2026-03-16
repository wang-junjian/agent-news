import { setupTestDb, teardownTestDb, createTestArticle } from "./test-utils";
import { articles } from "@/db/schema";

describe("Categories API (Database Tests)", () => {
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
    it("获取去重后的分类列表", async () => {
      await testDb.insert(articles).values([
        createTestArticle({ category: "NLP" }),
        createTestArticle({ category: "CV" }),
        createTestArticle({ category: "NLP" }),
      ]);

      const results = await testDb.select().from(articles);
      const categories = [...new Set(results.map((r: any) => r.category))];

      expect(categories).toContain("NLP");
      expect(categories).toContain("CV");
      expect(categories.length).toBe(2);
    });

    it("没有文章时返回空数组", async () => {
      const results = await testDb.select().from(articles);
      const categories = [...new Set(results.map((r: any) => r.category))];

      expect(categories.length).toBe(0);
    });
  });
});
