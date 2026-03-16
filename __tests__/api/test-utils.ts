import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";
import fs from "fs";
import path from "path";

export const TEST_DB_PATH = "./data/test.db";

export function setupTestDb() {
  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Remove existing test db
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }

  const sqlite = new Database(TEST_DB_PATH);

  // Create table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'AI Agent',
      tags TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  const db = drizzle(sqlite, { schema });
  return { sqlite, db };
}

export function teardownTestDb(sqlite: Database.Database) {
  sqlite.close();
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

export function createTestArticle(overrides: Partial<typeof schema.articles.$inferInsert> = {}) {
  const now = Math.floor(Date.now() / 1000);
  return {
    title: "测试文章",
    content: "# 测试内容\n\n这是测试内容",
    summary: "测试摘要",
    category: "NLP",
    author: "Test Author",
    tags: ["tag1", "tag2"],
    createdAt: new Date(now * 1000),
    updatedAt: new Date(now * 1000),
    ...overrides,
  };
}
