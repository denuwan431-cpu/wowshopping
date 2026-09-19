import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Frequently Asked Questions | Aura Apparel",
  description: "Answers about shipping, payments, garment fabrics, and custom DTF printing."
};

const faqs = [
  {
    q: "How long does islandwide delivery take?",
    a: "Orders in Colombo and suburbs are delivered within 1-2 business days. Outstation delivery takes 2-4 business days via tracked prompt courier."
  },
  {
    q: "What payment methods are supported?",
    a: "We support Visa, Mastercard, Cash on Delivery (COD), Direct Bank Transfer, Koko (3 interest-free installments), and Mintpay."
  },
  {
    q: "What file format is best for custom DTF printing?",
    a: "We recommend uploading a high-resolution PNG with transparent background at 300 DPI. High-resolution JPG, PDF, and SVG vector files are also fully supported."
  },
  {
    q: "How durable is DTF printing on t-shirts?",
    a: "Our commercial DTF printing uses flexible pigment polymers that withstand 50+ machine washes without peeling or cracking when washed inside-out in cold water."
  },
  {
    q: "Is there a minimum order quantity (MOQ) for custom printing?",
    a: "No! You can print a single custom t-shirt from Rs. 650/=. We also offer automatic volume discounts for orders of 6+ and 20+ pieces."
  }
];

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black font-heading text-slate-900 uppercase">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-500">Everything you need to know about our products and printing services</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
