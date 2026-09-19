"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  Scissors,
  Layers,
  Sparkles,
  Info,
  Clock,
  Truck,
  ShieldCheck,
  Check,
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { formatPrice } from "@/lib/utils";

interface GarmentOption {
  id: string;
  name: string;
  baseCost: number;
  description: string;
}

const garments: GarmentOption[] = [
  { id: "crewneck", name: "Classic Crewneck T-Shirt (180 GSM)", baseCost: 750, description: "100% Ring-spun combed cotton, pre-shrunk." },
  { id: "oversized", name: "Heavyweight Boxy Tee (240 GSM)", baseCost: 1100, description: "Premium architectural drop-shoulder streetwear cut." },
  { id: "kids_tee", name: "Kids Combed Cotton T-Shirt (180 GSM)", baseCost: 650, description: "Gentle anti-scratch flatlock seam construction." },
  { id: "tank_top", name: "Ribbed Sleeveless Tank Top", baseCost: 700, description: "Sporty casual lightweight breathable summer fit." },
  { id: "hoodie", name: "Heavyweight Fleece Hoodie (320 GSM)", baseCost: 2200, description: "Plush brushed fleece interior with kangaroo pocket." }
];

const printAreas = [
  { id: "chest_a6", name: "Chest Pocket / Badge (A6 - 10x10 cm)", cost: 250, badge: "MOST POPULAR" },
  { id: "front_a4", name: "Front Center (A4 - 21x30 cm)", cost: 450, badge: "STANDARD" },
  { id: "back_a3", name: "Back Full Graphic (A3 - 30x42 cm)", cost: 650, badge: "IMPACT" },
  { id: "dual_front_back", name: "Dual-Sided (Chest A6 + Back A3)", cost: 850, badge: "FULL MERCH" }
];

const garmentColors = [
  { name: "Jet Black", hex: "#0f172a", textContrast: "white" },
  { name: "Pure White", hex: "#f8fafc", textContrast: "slate-900" },
  { name: "Navy Blue", hex: "#1e293b", textContrast: "white" },
  { name: "Forest Green", hex: "#14532d", textContrast: "white" },
  { name: "Sand Khaki", hex: "#d6c7b2", textContrast: "slate-900" },
  { name: "Coral Rose", hex: "#f43f5e", textContrast: "white" }
];

const garmentSizes = ["Month 6-18", "Year 2-3", "Year 4-5", "XS", "S", "M", "L", "XL", "XXL"];

export function DtfStudioClient() {
  const { addItem } = useCart();
  const { theme } = useTheme();

  const [selectedGarment, setSelectedGarment] = useState<GarmentOption>(garments[0]);
  const [selectedColor, setSelectedColor] = useState(garmentColors[0]);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedArea, setSelectedArea] = useState(printAreas[1]);
  const [quantity, setQuantity] = useState(1);
  const [fileUrl, setFileUrl] = useState<string>("https://images.pexels.com/photos/8764343/pexels-photo-8764343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600");
  const [designNotes, setDesignNotes] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  // Volume discount calculation
  let discountMultiplier = 1.0;
  if (quantity >= 20) discountMultiplier = 0.8;
  else if (quantity >= 6) discountMultiplier = 0.9;

  const unitPrice = Math.round((selectedGarment.baseCost + selectedArea.cost) * discountMultiplier);
  const totalPrice = unitPrice * quantity;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local blob preview
      const previewUrl = URL.createObjectURL(file);
      setFileUrl(previewUrl);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      alert("Please enter your name, email, and phone number to submit your DTF request.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dtf-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          garmentType: selectedGarment.name,
          garmentColor: selectedColor.name,
          garmentSize: selectedSize,
          quantity,
          printArea: selectedArea.name,
          fileUrl,
          designNotes,
          estimatedCost: totalPrice
        })
      });

      const data = await res.json();
      if (res.ok) {
        // Also add to cart for direct online payment if desired
        addItem({
          productId: 9999, // custom dtf identifier
          name: `Custom DTF Print: ${selectedGarment.name}`,
          variantTitle: `${selectedSize} / ${selectedColor.name} (${selectedArea.name})`,
          price: unitPrice,
          regularPrice: selectedGarment.baseCost + selectedArea.cost,
          image: fileUrl,
          quantity,
          size: selectedSize,
          colorName: selectedColor.name,
          isCustomDtf: true,
          customDetails: {
            garmentType: selectedGarment.name,
            garmentColor: selectedColor.name,
            garmentSize: selectedSize,
            printArea: selectedArea.name,
            fileUrl
          }
        });

        setSubmittedSuccess(true);
        setSubmissionMessage("Your custom DTF print request has been saved and added to your bag! Our studio team will review your artwork dimensions.");
      } else {
        alert(data.message || "Failed to submit custom order");
      }
    } catch {
      alert("Network error submitting DTF order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Header */}
      <div className="relative bg-slate-950 text-white py-16 px-4 overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/27893026/pexels-photo-27893026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600')"
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Scissors className="w-3.5 h-3.5 text-teal-400" />
            AURA BESPOKE DTF PRINT ATELIER
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-heading">
            Direct-To-Film Garment Studio
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Museum-grade digital film transfer technology. Print photo-realistic color gradients, razor-sharp typography, and bespoke fashion merch on premium 180–240 GSM garments with zero minimum order quantities.
          </p>
        </div>
      </div>

      {/* Main Studio Interactive Customizer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Mockup Canvas Visualizer */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                LIVE GARMENT PREVIEW
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {selectedColor.name} // {selectedSize}
              </span>
            </div>

            {/* Realistic T-Shirt Mockup Canvas */}
            <div
              className="relative aspect-[3/4] w-full rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80 transition-colors duration-500"
              style={{ backgroundColor: selectedColor.hex }}
            >
              {/* Garment Silhouette Shadow Texture */}
              <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />

              {/* T-Shirt Collar / Shape Overlay */}
              <div className="absolute top-4 w-32 h-14 rounded-b-full border-b-4 border-black/20 pointer-events-none" />

              {/* Overlaid Artwork Mockup in chosen print area */}
              <div
                className={`relative z-10 transition-all duration-300 flex items-center justify-center p-2 rounded-lg border-2 border-dashed ${
                  selectedArea.id === "chest_a6"
                    ? "w-24 h-24 -translate-x-12 -translate-y-16 border-amber-400/80"
                    : selectedArea.id === "back_a3"
                    ? "w-48 h-64 border-teal-400/80"
                    : "w-40 h-52 border-teal-400/80"
                }`}
              >
                {fileUrl ? (
                  <img
                    src={fileUrl}
                    alt="Custom design preview"
                    className="max-h-full max-w-full object-contain filter drop-shadow-md rounded"
                  />
                ) : (
                  <div className="text-center text-xs p-2 text-white/80">
                    <Upload className="w-6 h-6 mx-auto mb-1 text-white/70" />
                    <span>Upload artwork to preview</span>
                  </div>
                )}
              </div>

              {/* Print Area Overlay Label */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                Area: {selectedArea.name}
              </div>
            </div>

            {/* Live Pricing Breakdown Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Garment: {selectedGarment.name}</span>
                <span className="font-semibold text-slate-900">{formatPrice(selectedGarment.baseCost, theme.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Print Area: {selectedArea.name}</span>
                <span className="font-semibold text-slate-900">+{formatPrice(selectedArea.cost, theme.currencySymbol)}</span>
              </div>
              {quantity >= 6 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Volume Tier Discount</span>
                  <span>{quantity >= 20 ? "-20%" : "-10%"}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900 text-sm">
                <span>Total for {quantity} pc{quantity > 1 ? "s" : ""}:</span>
                <span className="text-lg text-amber-600 font-black">{formatPrice(totalPrice, theme.currencySymbol)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Configurator & Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            {submittedSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">
                  Custom DTF Request Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {submissionMessage}
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    href="/checkout"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-md transition shadow"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-md transition"
                  >
                    Customize Another Shirt
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                {/* 1. Garment Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-2">
                    1. Select Garment Blank
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {garments.map((g) => (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setSelectedGarment(g)}
                        className={`p-3 rounded-xl border text-left transition ${
                          selectedGarment.id === g.id
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 hover:border-slate-400 bg-white text-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>{g.name}</span>
                          <span>{formatPrice(g.baseCost, theme.currencySymbol)}</span>
                        </div>
                        <p className={`text-[11px] mt-1 ${selectedGarment.id === g.id ? "text-slate-300" : "text-slate-500"}`}>
                          {g.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Garment Color */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-2">
                    2. Garment Color: <span className="text-amber-600">{selectedColor.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {garmentColors.map((c) => (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`w-10 h-10 rounded-full border-2 transition relative flex items-center justify-center ${
                          selectedColor.name === c.name ? "border-amber-500 scale-110 shadow" : "border-slate-200"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor.name === c.name && (
                          <Check className={`w-4 h-4 ${c.name === "Pure White" || c.name === "Sand Khaki" ? "text-slate-900" : "text-white"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Garment Size */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-2">
                    3. Garment Size: <span className="text-amber-600">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {garmentSizes.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                          selectedSize === s
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Print Area */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-2">
                    4. Print Area & Dimensions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {printAreas.map((pa) => (
                      <button
                        type="button"
                        key={pa.id}
                        onClick={() => setSelectedArea(pa)}
                        className={`p-3 rounded-xl border text-left transition ${
                          selectedArea.id === pa.id
                            ? "border-teal-600 bg-teal-50/70 border-2"
                            : "border-slate-200 hover:border-slate-400 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                          <span>{pa.name}</span>
                          <span className="text-teal-700">+{formatPrice(pa.cost, theme.currencySymbol)}</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          {pa.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Artwork File Upload */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-2">
                    5. Upload Design Artwork (PNG, JPG, SVG, PDF)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Drag & Drop your artwork here or <span className="text-amber-600 underline">Browse Files</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Transparent PNG with 300 DPI recommended for best print vibrancy. Max file size: 25MB.
                    </p>
                  </div>
                </div>

                {/* 6. Quantity Stepper */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      6. Quantity
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Volume tier: 6+ pcs (10% off) • 20+ pcs (20% off)
                    </span>
                  </div>
                  <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center text-xs font-bold py-2 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 7. Design Instructions */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-1">
                    7. Placement & Design Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="Specific placement notes, Pantone colors, or scaling instructions..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* 8. Contact Details */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Customer Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp *"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "SUBMITTING DESIGN..."
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      ORDER CUSTOM PRINTS • {formatPrice(totalPrice, theme.currencySymbol)}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
