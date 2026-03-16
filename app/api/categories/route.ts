import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { distinct } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db.select({ category: distinct(articles.category) }).from(articles);
    const categories = results.map((r) => r.category);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
