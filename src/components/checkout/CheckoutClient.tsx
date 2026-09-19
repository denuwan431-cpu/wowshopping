"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { formatPrice } from "@/lib/utils";

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, grandTotal, appliedCoupon, clearCart } = useCart();
  const { theme } = useTheme();

  const [customerName, setCustomerName] = useState("Dulani Perera");
  const [customerEmail, setCustomerEmail] = useState("dulani@example.com");
  const [customerPhone, setCustomerPhone] = useState("+94 71 301 6688");

  // Shipping
  const [addressLine, setAddressLine] = useState("406/B2/1 Thalagala Junction");
  const [city, setCity] = useState("Homagama");
  const [postalCode, setPostalCode] = useState("10200");
  const [notes, setNotes] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "bank_transfer" | "koko" | "mintpay">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card simulation state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-slate-900">Your bag is empty</h2>
        <p className="text-xs text-slate-500">Add some garments to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold uppercase tracking-wider"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: {
            fullName: customerName,
            addressLine,
            city,
            postalCode,
            country: "Sri Lanka"
          },
          paymentMethod,
          items,
          couponCode: appliedCoupon?.code,
          notes
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/checkout/confirmation?orderNumber=${data.orderNumber}`);
      } else {
        alert(data.message || "Failed to process order.");
        setIsSubmitting(false);
      }
    } catch {
      alert("Network error processing order");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 uppercase tracking-tight">
          Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your order with secure 256-bit encrypted checkout.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details, Shipping, Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>1. Customer Information</span>
              <span className="text-[11px] text-slate-400 lowercase font-normal">guest or registered</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              2. Islandwide Delivery Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. 406/B2/1 Thalagala Junction"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Homagama / Colombo / Kandy"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10200"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, landmark, or best time to deliver..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>3. Payment Architecture</span>
              <div className="flex items-center gap-1 text-[11px] text-green-700">
                <Lock className="w-3 h-3" />
                <span>SSL Secured</span>
              </div>
            </h2>

            <div className="space-y-3">
              {/* Card */}
              <label className={`block p-4 rounded-xl border transition cursor-pointer ${paymentMethod === "card" ? "border-slate-900 bg-slate-50/80" : "border-slate-200 hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="text-slate-900"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Credit / Debit Card</span>
                      <span className="text-[11px] text-slate-500">Visa, Mastercard, AMEX with instant receipt</span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-slate-600" />
                </div>

                {paymentMethod === "card" && (
                  <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Expires</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Cash On Delivery */}
              <label className={`block p-4 rounded-xl border transition cursor-pointer ${paymentMethod === "cod" ? "border-slate-900 bg-slate-50/80" : "border-slate-200 hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="text-slate-900"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-slate-500">Pay cash upon courier delivery at your doorstep</span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-slate-600" />
                </div>
              </label>

              {/* Koko BNPL */}
              <label className={`block p-4 rounded-xl border transition cursor-pointer ${paymentMethod === "koko" ? "border-slate-900 bg-slate-50/80" : "border-slate-200 hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "koko"}
                      onChange={() => setPaymentMethod("koko")}
                      className="text-slate-900"
                    />
                    <div>
                      <span className="font-bold text-xs text-amber-600 block">Koko: Pay in 3 Installments</span>
                      <span className="text-[11px] text-slate-500">
                        Pay 3 interest-free installments of {formatPrice(grandTotal / 3, theme.currencySymbol)}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">KOKO</span>
                </div>
              </label>

              {/* Bank Transfer */}
              <label className={`block p-4 rounded-xl border transition cursor-pointer ${paymentMethod === "bank_transfer" ? "border-slate-900 bg-slate-50/80" : "border-slate-200 hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                      className="text-slate-900"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Direct Bank Transfer</span>
                      <span className="text-[11px] text-slate-500">Commercial Bank / Sampath Bank deposit</span>
                    </div>
                  </div>
                  <Building className="w-5 h-5 text-slate-600" />
                </div>
                {paymentMethod === "bank_transfer" && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <p><strong>Bank:</strong> Commercial Bank of Ceylon</p>
                    <p><strong>Account Name:</strong> Aura Apparel (Pvt) Ltd</p>
                    <p><strong>Account No:</strong> 800-492-1094</p>
                    <p className="text-slate-400">Please WhatsApp deposit slip to {theme.whatsapp}</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
            Order Summary ({items.length} item{items.length > 1 ? "s" : ""})
          </h2>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
            {items.map((i) => (
              <div key={i.id} className="py-3 flex gap-3 text-xs">
                <img src={i.image} alt={i.name} className="w-14 h-16 object-cover rounded-lg border border-slate-200 bg-slate-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{i.name}</h4>
                  <p className="text-slate-500 text-[11px]">
                    Qty: {i.quantity} {i.size && `• Size: ${i.size}`}
                  </p>
                  <span className="font-bold text-slate-900 block mt-1">
                    {formatPrice(i.price * i.quantity, theme.currencySymbol)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatPrice(subtotal, theme.currencySymbol)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discount, theme.currencySymbol)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Islandwide Courier</span>
              <span className="font-bold text-slate-900">
                {shippingFee === 0 ? <span className="text-green-600 font-bold">Free</span> : formatPrice(shippingFee, theme.currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-200 pt-3">
              <span>Total Payable</span>
              <span>{formatPrice(grandTotal, theme.currencySymbol)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-lime-600 hover:bg-lime-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-lime-600/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "PROCESSING ORDER..."
            ) : (
              <>
                PLACE ORDER • {formatPrice(grandTotal, theme.currencySymbol)}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
