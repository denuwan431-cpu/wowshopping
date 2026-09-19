import { notFound } from "next/navigation";
import { db } from "@/db";
import { products, productVariants, reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) {
    notFound();
  }

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt));

  return (
    <ProductDetailClient
      product={product}
      variants={variants}
      initialReviews={productReviews}
    />
  );
}
