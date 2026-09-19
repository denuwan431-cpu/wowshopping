import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { getSessionUser, isAdminRole } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const prods = await db.select().from(products).orderBy(desc(products.createdAt));
    const variants = await db.select().from(productVariants);
    const byProduct = new Map<number, any[]>();
    for (const v of variants) byProduct.set(v.productId, [...(byProduct.get(v.productId)||[]), v]);
    return NextResponse.json({ products: prods.map(p => ({...p, variants: byProduct.get(p.id)||[]})) });
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !isAdminRole(sessionUser.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      sku,
      description,
      shortDescription,
      categoryId,
      basePrice,
      salePrice,
      stockQuantity,
      primaryImage,
      secondaryImage,
      tags,
      isFeatured,
      variants,
      galleryImages,
      attributes
    } = body;

    if (!name || !sku || !basePrice || !primaryImage) {
      return NextResponse.json({ message: "Name, SKU, base price, and primary image are required" }, { status: 400 });
    }

    const slug = slugify(name) + `-${Math.floor(100 + Math.random() * 900)}`;

    const [newProd] = await db.insert(products).values({
      name,
      slug,
      sku,
      description: description || name,
      shortDescription: shortDescription || "",
      categoryId: categoryId ? Number(categoryId) : null,
      basePrice: Number(basePrice).toFixed(2),
      salePrice: salePrice ? Number(salePrice).toFixed(2) : null,
      stockQuantity: Number(stockQuantity) || 50,
      primaryImage,
      secondaryImage: secondaryImage || primaryImage,
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: !!isFeatured,
      isPublished: body.isPublished !== false,
      galleryImages: Array.isArray(galleryImages) && galleryImages.length ? galleryImages.slice(0,5) : [primaryImage, secondaryImage || primaryImage],
      attributes: attributes && typeof attributes === 'object' ? attributes : {}
    }).returning();

    // Create variants if provided
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        await db.insert(productVariants).values({
          productId: newProd.id,
          sku: `${sku}-${(v.size || "M").replace(/\s+/g, "")}-${(v.colorName || "STD").replace(/\s+/g, "")}`.toUpperCase(),
          title: `${name} - ${v.size} / ${v.colorName}`,
          size: v.size || "M",
          colorName: v.colorName || "Standard",
          colorHex: v.colorHex || "#1e293b",
          material: "100% Cotton",
          price: Number(basePrice).toFixed(2),
          salePrice: salePrice ? Number(salePrice).toFixed(2) : null,
          stockQuantity: Number(v.stockQuantity) || 10,
          imageUrl: primaryImage,
          isActive: true
        });
      }
    }

    return NextResponse.json({ success: true, product: newProd });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !isAdminRole(sessionUser.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const safeData:any = {...data};
    delete safeData.variants;
    const [updated] = await db.update(products).set({...safeData, updatedAt:new Date()}).where(eq(products.id, Number(id))).returning();
    if (Array.isArray(body.variants)) {
      await db.delete(productVariants).where(eq(productVariants.productId, Number(id)));
      for (const v of body.variants) await db.insert(productVariants).values({productId:Number(id),sku:String(v.sku||`${updated.sku}-${v.size||'M'}-${v.colorName||'STD'}`).toUpperCase().replace(/\s+/g,''),title:String(v.title||`${updated.name} - ${v.size||'M'} / ${v.colorName||'Standard'}`),size:String(v.size||'M'),colorName:String(v.colorName||'Standard'),colorHex:String(v.colorHex||'#111827'),material:v.material||null,price:Number(v.price||updated.basePrice).toFixed(2),salePrice:v.salePrice?Number(v.salePrice).toFixed(2):null,stockQuantity:Number(v.stockQuantity||0),imageUrl:v.imageUrl||updated.primaryImage,isActive:v.isActive!==false});
    }
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !isAdminRole(sessionUser.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, Number(id)));

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
