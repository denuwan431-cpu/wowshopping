"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ArrowRight, Tag, Check, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    freeShippingThreshold,
    freeShippingProgress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    closeCart
  } = useCart();
  const { theme } = useTheme();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError("");
    setCouponSuccess("");

    const res = await applyCoupon(couponInput);
    setIsApplying(false);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput("");
    } else {
      setCouponError(res.message);
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-fade-in">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                YOUR SHOPPING BAG ({totalCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition border border-slate-200"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50/90 border-b border-amber-200/60 px-5 py-3">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                {amountToFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-amber-700">{formatPrice(amountToFreeShipping, theme.currencySymbol)}</strong> more for <strong>FREE DELIVERY</strong>
                  </span>
                ) : (
                  <span className="text-green-700 font-bold">
                    You have unlocked FREE Islandwide Delivery!
                  </span>
                )}
              </div>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore our latest premium kids loungewear, unisex t-shirts, and custom DTF designs.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-slate-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      {(item.size || item.colorName) && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.size && item.colorName && <span> • </span>}
                          {item.colorName && <span>Color: {item.colorName}</span>}
                        </p>
                      )}

                      {item.isCustomDtf && item.customDetails && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded border border-teal-200">
                          Custom DTF Print
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                          {formatPrice(item.price * item.quantity, theme.currencySymbol)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400">
                            {formatPrice(item.price, theme.currencySymbol)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Promo Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-md text-xs">
                    <div className="flex items-center gap-1.5 text-green-800 font-semibold">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Code <strong>{appliedCoupon.code}</strong> Applied (-{appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : formatPrice(appliedCoupon.discountValue, theme.currencySymbol)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 font-bold hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo Code (e.g. AURA10)"
                        className="w-full px-3 py-2 text-xs uppercase bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-bold uppercase transition disabled:opacity-50"
                    >
                      {isApplying ? "..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-green-600 mt-1">{couponSuccess}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal, theme.currencySymbol)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(discount, theme.currencySymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Islandwide Shipping</span>
                  <span className="font-semibold text-slate-800">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-bold uppercase">Free</span>
                    ) : (
                      formatPrice(shippingFee, theme.currencySymbol)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal, theme.currencySymbol)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md text-xs font-bold uppercase tracking-wider text-center transition"
                >
                  VIEW FULL CART
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
