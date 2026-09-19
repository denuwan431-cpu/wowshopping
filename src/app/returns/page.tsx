import React from "react";
import Link from "next/link";
import { RefreshCw, ShieldCheck, Truck, Check } from "lucide-react";

export const metadata = {
  title: "Return & Exchange Policy | Aura Apparel",
  description: "Learn about our seamless 7-day garment return and exchange guidelines."
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">CUSTOMER ASSURANCE</span>
        <h1 className="text-3xl font-black font-heading text-slate-900">Return & Exchange Policy</h1>
        <p className="text-xs text-slate-500">We want you and your little ones to love every garment.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <section className="space-y-3">
          <h2 className="text-base font-bold font-heading text-slate-900">7-Day Hassle-Free Exchange Window</h2>
          <p>
            If you ordered a size that doesn't fit comfortably, or wish to change color, you can request an exchange within <strong>7 days</strong> of receiving your delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold font-heading text-slate-900">Exchange Conditions</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Garments must be unworn, unwashed, and in original brand packaging with all tags attached.</li>
            <li>Custom DTF prints created with personal customer artwork are non-returnable unless there is a confirmed manufacturing or print defect.</li>
            <li>Discounted clearance sale items marked as final sale are exchangeable for alternate sizes only (subject to stock availability).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold font-heading text-slate-900">How to Initiate an Exchange</h2>
          <p>
            Simply WhatsApp our customer care team at <strong>+94 77 123 4567</strong> with your Order Number (e.g. <code>AUR-892401</code>) and the desired replacement size. Our courier partner will deliver your replacement garment and collect the previous item in a single convenient exchange step!
          </p>
        </section>
      </div>
    </div>
  );
}
