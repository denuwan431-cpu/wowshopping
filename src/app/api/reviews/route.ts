import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const body = await req.json();
    const { productId, rating, title, comment, customerName } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { message: "Product, rating, title, and comment are required" },
        { status: 400 }
      );
    }

    const nameToUse = customerName || sessionUser?.name || "Verified Customer";

    const [newReview] = await db
      .insert(reviews)
      .values({
        productId: Number(productId),
        userId: sessionUser?.id || null,
        customerName: nameToUse,
        rating: Math.min(5, Math.max(1, Number(rating))),
        title: title.trim(),
        comment: comment.trim(),
        isVerified: true,
        isApproved: true
      })
      .returning();

    // Recalculate product review count & average
    const allProductReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, Number(productId)));

    const count = allProductReviews.length;
    const avg =
      count > 0
        ? (
            allProductReviews.reduce((acc, r) => acc + r.rating, 0) / count
          ).toFixed(2)
        : "5.00";

    await db
      .update(products)
      .set({
        ratingAverage: avg,
        reviewCount: count
      })
      .where(eq(products.id, Number(productId)));

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Submit review error:", error);
    return NextResponse.json(
      { message: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      const allReviews = await db
        .select()
        .from(reviews)
        .orderBy(desc(reviews.createdAt))
        .limit(50);
      return NextResponse.json({ reviews: allReviews });
    }

    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, Number(productId)))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ reviews: productReviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}
