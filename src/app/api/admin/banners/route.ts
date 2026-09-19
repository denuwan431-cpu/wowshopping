import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { getSessionUser, isAdminRole } from "@/lib/auth";
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allBanners = await db
      .select()
      .from(banners)
      .orderBy(asc(banners.priority), desc(banners.createdAt));

    return NextResponse.json({ banners: allBanners });
  } catch (error) {
    console.error("Banner fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !isAdminRole(sessionUser.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const [newBanner] = await db.insert(banners).values(body).returning();

    return NextResponse.json({ success: true, banner: newBanner });
  } catch (error) {
    console.error("Banner create error:", error);
    return NextResponse.json({ message: "Failed to create banner" }, { status: 500 });
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
      return NextResponse.json({ message: "Banner ID is required" }, { status: 400 });
    }

    const [updated] = await db
      .update(banners)
      .set(data)
      .where(eq(banners.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, banner: updated });
  } catch (error) {
    console.error("Banner update error:", error);
    return NextResponse.json({ message: "Failed to update banner" }, { status: 500 });
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
      return NextResponse.json({ message: "Banner ID required" }, { status: 400 });
    }

    await db.delete(banners).where(eq(banners.id, Number(id)));

    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    console.error("Banner delete error:", error);
    return NextResponse.json({ message: "Failed to delete banner" }, { status: 500 });
  }
}
