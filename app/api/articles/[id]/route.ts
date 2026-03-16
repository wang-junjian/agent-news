import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateApiKey, authResponse } from "../../auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)));

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return authResponse();
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, summary, category, author, tags } = body;

    const [existing] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const [updatedArticle] = await db
      .update(articles)
      .set({
        title: title || existing.title,
        content: content || existing.content,
        summary: summary || existing.summary,
        category: category || existing.category,
        author: author !== undefined ? author : existing.author,
        tags: tags !== undefined ? tags : existing.tags,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return authResponse();
  }

  try {
    const { id } = await params;
    const [existing] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await db.delete(articles).where(eq(articles.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
