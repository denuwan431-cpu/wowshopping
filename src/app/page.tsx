import { db } from "@/db";
import { banners, categories, products } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { HomeClient } from "@/components/home/HomeClient";
import { themeSettings } from "@/db/schema";

export const revalidate = 0;

export default async function HomePage() {
  const [themeRow] = await db.select().from(themeSettings).limit(1);
  const siteConfig = ((themeRow?.socialLinksJson || {}) as any)._siteConfig || {};

  // Fetch active banners
  const allBanners = await db
    .select()
    .from(banners)
    .where(eq(banners.isActive, true))
    .orderBy(asc(banners.priority));

  // Fetch all categories
  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder));

  // Fetch all published products
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.createdAt));

  // Separate by category
  const kidsCat = allCategories.find((c) => c.slug === "kids");
  const pajamaCat = allCategories.find((c) => c.slug === "kids-pajamas");
  const skinnyCat = allCategories.find((c) => c.slug === "tank-skinny-tops");
  const adultsCat = allCategories.find((c) => c.slug === "adults");
  const dtfCat = allCategories.find((c) => c.slug === "dtf-printing");

  const kidsProducts = allProducts.filter((p) => p.categoryId === kidsCat?.id);
  const pajamaProducts = allProducts.filter((p) => p.categoryId === pajamaCat?.id);
  const skinnyProducts = allProducts.filter((p) => p.categoryId === skinnyCat?.id);
  const adultsProducts = allProducts.filter((p) => p.categoryId === adultsCat?.id);
  const dtfProducts = allProducts.filter((p) => p.categoryId === dtfCat?.id);

  return (
    <HomeClient
      banners={allBanners.map((b: any) => ({ ...b, videoUrl: siteConfig.heroVideoEnabled ? siteConfig.heroVideoUrl : null, posterUrl: siteConfig.heroVideoPoster || b.desktopImage }))}
      kidsProducts={kidsProducts.length > 0 ? kidsProducts : allProducts.slice(0, 4)}
      pajamaProducts={pajamaProducts.length > 0 ? pajamaProducts : allProducts.slice(0, 4)}
      skinnyProducts={skinnyProducts.length > 0 ? skinnyProducts : allProducts.slice(2, 6)}
      adultsProducts={adultsProducts.length > 0 ? adultsProducts : allProducts.slice(4, 8)}
      dtfProducts={dtfProducts.length > 0 ? dtfProducts : allProducts.slice(0, 4)}
      categories={allCategories}
    />
  );
}
