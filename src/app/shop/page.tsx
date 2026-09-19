import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ShopClient } from "@/components/shop/ShopClient";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sale?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialCategory = params.category || "all";
  const initialSearch = params.search || "";
  const initialSale = params.sale === "true";

  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.createdAt));

  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true));

  return (
    <ShopClient
      initialProducts={allProducts}
      categories={allCategories}
      initialCategory={initialCategory}
      initialSearch={initialSearch}
      initialSale={initialSale}
    />
  );
}
