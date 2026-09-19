import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { themeSettings } from "@/db/schema";
import { getSessionUser, isAdminRole } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const [theme] = await db.select().from(themeSettings).limit(1);
    return NextResponse.json({ theme });
  } catch (error) {
    console.error("Theme fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch theme" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !isAdminRole(sessionUser.role)) {
      return NextResponse.json({ message: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();

    const existing = await db.select().from(themeSettings).limit(1);

    if (existing.length === 0) {
      const [inserted] = await db.insert(themeSettings).values({
        ...body,
        updatedAt: new Date()
      }).returning();
      return NextResponse.json({ success: true, theme: inserted });
    } else {
      const [updated] = await db.update(themeSettings)
        .set({
          ...body,
          updatedAt: new Date()
        })
        .where(eq(themeSettings.id, existing[0].id))
        .returning();
      return NextResponse.json({ success: true, theme: updated });
    }
  } catch (error) {
    console.error("Theme update error:", error);
    return NextResponse.json({ message: "Failed to update theme" }, { status: 500 });
  }
}
