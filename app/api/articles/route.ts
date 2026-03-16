import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, like } from "drizzle-orm";
import { validateApiKey, authResponse } from "../auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let query = db.select().from(articles).orderBy(desc(articles.createdAt));

    if (search) {
      query = query.where(like(articles.title, `%${search}%`));
    }

    if (category) {
      if (search) {
        // @ts-ignore - drizzle type issue with multiple where clauses
        query = query.where(eq(articles.category, category));
      } else {
        query = query.where(eq(articles.category, category));
      }
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
