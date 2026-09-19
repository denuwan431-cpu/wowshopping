import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, productVariants } from "@/db/schema";
import { eq, and, or, ilike, desc, asc, gte, lte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const categorySlug = searchParams.get("category");
    const collectionSlug = searchParams.get("collection");
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const saleOnly = searchParams.get("sale") === "true";
    const limit = parseInt(searchParams.get("limit") || "40");

    let conditions: any[] = [eq(products.isPublished, true)];

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.sku, `%${search}%`)
        )
      );
    }

    if (categorySlug && categorySlug !== "all") {
      const [cat] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);

      if (cat) {
        conditions.push(eq(products.categoryId, cat.id));
      }
    }

    if (minPrice) {
      conditions.push(gte(products.basePrice, minPrice));
    }
    if (maxPrice) {
      conditions.push(lte(products.basePrice, maxPrice));
    }

    let orderByClause = desc(products.createdAt);
    if (sort === "price_asc") {
      orderByClause = asc(products.basePrice);
    } else if (sort === "price_desc") {
      orderByClause = desc(products.basePrice);
    } else if (sort === "best_selling" || sort === "popularity") {
      orderByClause = desc(products.reviewCount);
    } else if (sort === "highest_rated") {
      orderByClause = desc(products.ratingAverage);
    }

    const prods = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        shortDescription: products.shortDescription,
        description: products.description,
        categoryId: products.categoryId,
        collectionId: products.collectionId,
        brand: products.brand,
        basePrice: products.basePrice,
        salePrice: products.salePrice,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
        ratingAverage: products.ratingAverage,
        reviewCount: products.reviewCount,
        primaryImage: products.primaryImage,
        secondaryImage: products.secondaryImage,
        galleryImages: products.galleryImages,
        attributes: products.attributes,
        tags: products.tags,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt
      })
      .from(products)
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit);

    // If sale only requested
    let results = prods;
    if (saleOnly) {
      results = results.filter((p) => p.salePrice && parseFloat(p.salePrice) < parseFloat(p.basePrice));
    }

    return NextResponse.json({
      count: results.length,
      products: results
    });
  } catch (error) {
    console.error("Products query error:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}
