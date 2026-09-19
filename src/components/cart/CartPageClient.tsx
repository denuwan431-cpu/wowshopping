"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, ArrowRight, Check, ShoppingBag, Truck, RotateCcw } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    freeShippingThreshold,
    freeShippingProgress,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { theme } = useTheme();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponMsg("");
    const res = await applyCoupon(couponCode);
    setIsApplying(false);
    setCouponMsg(res.message);
    if (res.success) setCouponCode("");
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <h1 className="text-3xl font-black font-heading text-slate-900">Cart</h1>
        <div className="p-4 bg-sky-50/80 border border-sky-200 text-slate-700 text-xs sm:text-sm rounded-lg max-w-xl mx-auto">
          Your cart is currently empty.
        </div>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs uppercase tracking-wider rounded-md transition shadow"
          >
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black font-heading text-slate-900 uppercase tracking-tight">Cart</h1>
      </div>

      {/* Free Shipping Bar */}
      <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex justify-between items-center text-xs font-semibold text-amber-900 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-600" />
            {amountToFreeShipping > 0 ? (
              <span>Add <strong>{formatPrice(amountToFreeShipping, theme.currencySymbol)}</strong> more to get <strong>FREE ISLANDWIDE DELIVERY</strong></span>
            ) : (
              <span className="text-green-700 font-bold">You qualify for FREE Delivery!</span>
            )}
          </div>
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
          <div className="bg-amber-600 h-full rounded-full transition-all duration-300" style={{ width: `${freeShippingProgress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4 text-right">Subtotal</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded-lg border border-slate-200 bg-slate-100 flex-shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h3>
                          {(item.size || item.colorName) && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.size && item.colorName && <span> • </span>}
                              {item.colorName && <span>Color: {item.colorName}</span>}
                            </p>
                          )}
                          {item.isCustomDtf && (
                            <span className="inline-block mt-1 px-1.5 py-0.2 bg-teal-50 text-teal-700 text-[10px] font-bold rounded border border-teal-200">
                              Custom DTF
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {formatPrice(item.price, theme.currencySymbol)}
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 text-right">
                      {formatPrice(item.price * item.quantity, theme.currencySymbol)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
            <Link href="/shop" className="font-bold text-amber-600 hover:underline">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-slate-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Cart
            </button>
          </div>
        </div>

        {/* Totals & Checkout Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold font-heading uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
            Cart Totals
          </h2>

          {/* Coupon */}
          <div className="space-y-2">
            {appliedCoupon ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs flex justify-between items-center text-green-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Coupon {appliedCoupon.code} applied!</span>
                </div>
                <button onClick={removeCoupon} className="text-red-500 hover:underline font-bold">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (AURA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs uppercase border border-slate-300 rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isApplying || !couponCode.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase transition"
                >
                  Apply
                </button>
              </form>
            )}
            {couponMsg && <p className="text-[11px] text-slate-600">{couponMsg}</p>}
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatPrice(subtotal, theme.currencySymbol)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>Discount</span>
                <span>-{formatPrice(discount, theme.currencySymbol)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Islandwide Shipping</span>
              <span className="font-bold text-slate-900">
                {shippingFee === 0 ? <span className="text-green-600">Free</span> : formatPrice(shippingFee, theme.currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-200 pt-3">
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal, theme.currencySymbol)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 px-6 bg-lime-600 hover:bg-lime-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2"
          >
            PROCEED TO CHECKOUT
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
