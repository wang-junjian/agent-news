import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, like, or, and } from "drizzle-orm";
import { validateApiKey, authResponse } from "../auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let query = db.select().from(articles).orderBy(desc(articles.createdAt));

    const filters = [];
    if (search) {
      filters.push(or(
        like(articles.title, `%${search}%`),
        like(articles.content, `%${search}%`)
      ));
    }

    if (category) {
      filters.push(eq(articles.category, category));
    }

    if (filters.length > 0) {
      // @ts-expect-error - drizzle type issue with dynamic filters
      query = query.where(and(...filters));
    }

    const results = await query;

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return authResponse();
  }

  try {
    const body = await request.json();
    const { title, content, summary, category, author, tags } = body;

    if (!title || !content || !summary || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, summary, category" },
        { status: 400 }
      );
    }

    const now = new Date();
    const [newArticle] = await db
      .insert(articles)
      .values({
        title,
        content,
        summary,
        category,
        author: author || "AI Agent",
        tags: tags || [],
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
