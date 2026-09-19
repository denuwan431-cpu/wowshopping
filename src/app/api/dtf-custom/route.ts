import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dtfCustomOrders } from "@/db/schema";
import { getSessionUser, isAdminRole } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      garmentType,
      garmentColor,
      garmentSize,
      quantity,
      printArea,
      fileUrl,
      designNotes,
      estimatedCost
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !garmentType || !garmentColor || !garmentSize || !fileUrl) {
      return NextResponse.json(
        { message: "Please fill out all required fields and upload your design artwork." },
        { status: 400 }
      );
    }

    const [newDtfOrder] = await db
      .insert(dtfCustomOrders)
      .values({
        userId: sessionUser?.id || null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        garmentType,
        garmentColor,
        garmentSize,
        quantity: Math.max(1, Number(quantity) || 1),
        printArea: printArea || "Front Center (A4)",
        fileUrl,
        designNotes: designNotes || "",
        estimatedCost: estimatedCost ? Number(estimatedCost).toFixed(2) : "950.00",
        status: "pending_review"
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Custom DTF print request submitted successfully!",
      order: newDtfOrder
    });
  } catch (error) {
    console.error("DTF custom order submission error:", error);
    return NextResponse.json(
      { message: "Failed to submit custom print order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !isAdminRole(sessionUser.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const ordersList = await db
      .select()
      .from(dtfCustomOrders)
      .orderBy(desc(dtfCustomOrders.createdAt))
      .limit(50);

    return NextResponse.json({ orders: ordersList });
  } catch (error) {
    console.error("DTF fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch DTF orders" }, { status: 500 });
  }
}
