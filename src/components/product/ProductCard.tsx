"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Star, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";

export interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    sku: string;
    basePrice: string | number;
    salePrice?: string | number | null;
    primaryImage: string;
    secondaryImage?: string | null;
    ratingAverage?: string | number | null;
    reviewCount?: number;
    stockQuantity?: number;
    isFeatured?: boolean;
    tags?: string[] | null;
    attributes?: Record<string, string[]> | null;
  };
  onQuickView?: (product: any) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(product.primaryImage);
  const [isAdded, setIsAdded] = useState(false);

  const basePriceNum = Number(product.basePrice);
  const salePriceNum = product.salePrice ? Number(product.salePrice) : null;
  const hasSale = salePriceNum !== null && salePriceNum < basePriceNum;
  const discountPercent = hasSale ? Math.round(((basePriceNum - salePriceNum) / basePriceNum) * 100) : 0;

  const inWishlist = isInWishlist(product.id);
  const isLowStock = (product.stockQuantity ?? 50) <= 5 && (product.stockQuantity ?? 50) > 0;
  const isOutOfStock = (product.stockQuantity ?? 50) === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: hasSale ? salePriceNum! : basePriceNum,
      regularPrice: basePriceNum,
      image: product.primaryImage,
      quantity: 1,
      size: "M",
      colorName: "Standard"
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative bg-white rounded-xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.secondaryImage) setActiveImage(product.secondaryImage);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImage(product.primaryImage);
      }}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {hasSale && (
            <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-red-600 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white shadow-sm">
              HOT
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Top-Right Quick Actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              inWishlist
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-600" : ""}`} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick view"
              className="w-8 h-8 rounded-full bg-white/90 text-slate-600 hover:text-slate-950 hover:bg-white border border-slate-200/60 flex items-center justify-center transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hover Quick Add Overlay */}
        <div className="absolute bottom-3 inset-x-3 z-10 transition-all duration-200 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md ${
              isOutOfStock
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : isAdded
                ? "bg-green-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                ADDED TO BAG
              </>
            ) : isOutOfStock ? (
              "OUT OF STOCK"
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                QUICK ADD
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1 text-[11px] text-slate-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-semibold text-slate-700">
              {Number(product.ratingAverage || 5).toFixed(1)}
            </span>
            <span>({product.reviewCount || 12})</span>
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-amber-600 transition line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing Area */}
        <div className="pt-1 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {formatPrice(hasSale ? salePriceNum : basePriceNum, theme.currencySymbol)}
          </span>
          {hasSale && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(basePriceNum, theme.currencySymbol)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
