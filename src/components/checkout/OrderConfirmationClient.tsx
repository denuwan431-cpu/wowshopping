"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  PackageCheck,
  Calendar,
  Clock
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

export function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const { theme } = useTheme();

  const [order, setOrder] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber!)}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
          setItems(data.items || []);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-3 font-semibold">Retrieving your order invoice...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700">
            ORDER CONFIRMED & IN PROCESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            Thank you for shopping with {theme.storeName}!
          </h1>
          <p className="text-xs text-slate-500">
            An order confirmation receipt has been sent to <strong>{order?.customerEmail || "your email"}</strong>.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px]">ORDER NUMBER</span>
            <span className="font-bold text-slate-900 text-sm">{order?.orderNumber || orderNumber}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px]">COURIER TRACKING</span>
            <span className="font-bold text-amber-600 text-sm">{order?.trackingNumber || "PRN-LK-90231"}</span>
          </div>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Delivery Status Timeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-900 font-bold">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <span>1. Order Placed</span>
          </div>
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-900 font-bold">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <span>2. Confirmed</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold">
            <Clock className="w-5 h-5 mx-auto mb-1 text-amber-600 animate-pulse" />
            <span>3. Packing & Quality</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-medium">
            <Truck className="w-5 h-5 mx-auto mb-1" />
            <span>4. Dispatched</span>
          </div>
        </div>
      </div>

      {/* Invoice Details Container */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm print:shadow-none">
        <div className="flex justify-between items-start pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-black font-heading text-slate-900">{theme.storeName}</h2>
            <p className="text-xs text-slate-500">{theme.address}</p>
            <p className="text-xs text-slate-500">Hotline: {theme.phone}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
        </div>

        {/* Ordered Garments List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Items in Order
          </h4>
          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-12 h-14 object-cover rounded bg-slate-100" />
                  )}
                  <div>
                    <h5 className="font-bold text-slate-900">{item.productName}</h5>
                    {item.variantTitle && <p className="text-slate-500 text-[11px]">{item.variantTitle}</p>}
                    <span className="text-slate-400 text-[11px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  {formatPrice(item.total, theme.currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 pt-4 space-y-1.5 text-xs text-slate-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">{formatPrice(order?.subtotal, theme.currencySymbol)}</span>
          </div>
          {parseFloat(order?.discount || "0") > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount</span>
              <span>-{formatPrice(order?.discount, theme.currencySymbol)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Islandwide Delivery</span>
            <span className="font-semibold text-slate-800">
              {parseFloat(order?.shippingFee || "0") === 0 ? "Free" : formatPrice(order?.shippingFee, theme.currencySymbol)}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-200 pt-2">
            <span>Total Paid</span>
            <span>{formatPrice(order?.total, theme.currencySymbol)}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
