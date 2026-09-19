import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { getSessionUser, isAdminRole } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return NextResponse.json({ order, items });
  } catch (error) {
    console.error("Fetch order detail error:", error);
    return NextResponse.json({ message: "Failed to fetch order details" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !isAdminRole(sessionUser.role)) {
      return NextResponse.json({ message: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { id } = await params;
    const orderId = parseInt(id);
    const body = await req.json();

    const { orderStatus, paymentStatus, trackingNumber } = body;

    const [updated] = await db
      .update(orders)
      .set({
        ...(orderStatus ? { orderStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ message: "Failed to update order" }, { status: 500 });
  }
}
