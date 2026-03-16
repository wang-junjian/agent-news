import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull().default("AI Agent"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
