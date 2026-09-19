import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();
    const subtotal = parseFloat(searchParams.get("subtotal") || "0");

    if (!code) {
      return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 400 });
    }

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, message: "Invalid or expired coupon code" }, { status: 404 });
    }

    if (coupon.minOrderAmount && subtotal < parseFloat(coupon.minOrderAmount)) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of Rs. ${parseFloat(coupon.minOrderAmount).toLocaleString()} required for this coupon`
      }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: "This coupon has reached its maximum usage limit" }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ valid: false, message: "Failed to validate coupon" }, { status: 500 });
  }
}
