import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, coupons, users } from "@/db/schema";
import { getSessionUser, isAdminRole } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      paymentMethod,
      items,
      couponCode,
      notes
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length) {
      return NextResponse.json(
        { message: "Missing required order information" },
        { status: 400 }
      );
    }

    // Compute subtotal
    let subtotalNum = 0;
    for (const item of items) {
      subtotalNum += (Number(item.price) || 0) * (Number(item.quantity) || 1);
    }

    // Compute discount
    let discountNum = 0;
    if (couponCode) {
      const [appliedCoupon] = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, couponCode.trim().toUpperCase()))
        .limit(1);

      if (appliedCoupon && appliedCoupon.isActive) {
        if (appliedCoupon.discountType === "percentage") {
          discountNum = (subtotalNum * Number(appliedCoupon.discountValue)) / 100;
        } else {
          discountNum = Number(appliedCoupon.discountValue);
        }
        if (discountNum > subtotalNum) discountNum = subtotalNum;

        // Increment coupon usage
        await db
          .update(coupons)
          .set({ usageCount: (appliedCoupon.usageCount || 0) + 1 })
          .where(eq(coupons.id, appliedCoupon.id));
      }
    }

    const shippingFeeNum = subtotalNum >= 5000 ? 0 : 350;
    const totalNum = Math.max(0, subtotalNum - discountNum + shippingFeeNum);

    const orderNumber = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: sessionUser?.id || null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        paymentMethod: paymentMethod || "card",
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        orderStatus: "confirmed",
        subtotal: subtotalNum.toFixed(2),
        discount: discountNum.toFixed(2),
        shippingFee: shippingFeeNum.toFixed(2),
        tax: "0.00",
        total: totalNum.toFixed(2),
        couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
        trackingNumber: `PRN-LK-${Math.floor(100000 + Math.random() * 900000)}`,
        notes: notes || null
      })
      .returning();

    // Insert order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId || null,
        variantId: item.variantId || null,
        productName: item.name,
        variantTitle: item.variantTitle || item.size ? `${item.size || ""} ${item.colorName || ""}`.trim() : null,
        price: Number(item.price).toFixed(2),
        quantity: Number(item.quantity) || 1,
        total: (Number(item.price) * (Number(item.quantity) || 1)).toFixed(2),
        imageUrl: item.image || null
      });
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      order: newOrder
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { message: "Failed to place order. Please check your details." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");

    if (orderNumber) {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber))
        .limit(1);

      if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      return NextResponse.json({ order, items });
    }

    if (!sessionUser) {
      return NextResponse.json({ orders: [] });
    }

    // If admin, can return all or filtered
    if (isAdminRole(sessionUser.role)) {
      const allOrders = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(100);

      return NextResponse.json({ orders: allOrders });
    }

    // Customer orders
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, sessionUser.id))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    console.error("Fetch orders failed:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
