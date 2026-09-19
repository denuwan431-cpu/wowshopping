"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Check, ShoppingBag, Heart, Star, ShieldCheck, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";

interface QuickViewModalProps {
  product: any | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { theme } = useTheme();

  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Standard");
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState<string>(product?.primaryImage || "");
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const basePriceNum = Number(product.basePrice);
  const salePriceNum = product.salePrice ? Number(product.salePrice) : null;
  const hasSale = salePriceNum !== null && salePriceNum < basePriceNum;
  const currentPrice = hasSale ? salePriceNum! : basePriceNum;

  const sizes = product.attributes?.Size || ["Month 6-18", "Year 2-3", "Year 4-5", "S", "M", "L", "XL"];
  const colors = product.attributes?.Color || ["Pure Black", "Pure White", "Dusty Pink", "Sage Green"];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      regularPrice: basePriceNum,
      image: activeImg || product.primaryImage,
      quantity,
      size: selectedSize,
      colorName: selectedColor
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white border border-slate-200">
              <img
                src={activeImg || product.primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.galleryImages && product.galleryImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.galleryImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      activeImg === img ? "border-amber-500" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">SKU: {product.sku}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-1">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <div className="flex text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="font-semibold text-slate-800">{Number(product.ratingAverage || 5).toFixed(1)}</span>
                  <span>({product.reviewCount || 24} customer reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(currentPrice, theme.currencySymbol)}
                </span>
                {hasSale && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(basePriceNum, theme.currencySymbol)}
                  </span>
                )}
              </div>

              {/* Sizing */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span>SELECT SIZE: {selectedSize}</span>
                  <Link href="/size-guide" className="text-amber-600 hover:underline">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                        selectedSize === s
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  COLOR: {selectedColor}
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                        selectedColor === c
                          ? "bg-amber-500 text-slate-950 border-amber-600 font-bold"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">QUANTITY</span>
                <div className="inline-flex items-center border border-slate-300 rounded-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 px-6 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    ADD TO BAG
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-amber-600 font-bold hover:underline"
                >
                  View Full Product Details →
                </Link>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-400" />
                  <span>Islandwide Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
