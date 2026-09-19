"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItem } = useCart();
  const { theme } = useTheme();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        const res = await fetch("/api/products?limit=50");
        const data = await res.json();
        if (data.products) {
          const matched = data.products.filter((p: any) => wishlist.includes(p.id));
          setProducts(matched);
        }
      } catch (e) {
        console.error("Wishlist load error", e);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black font-heading text-slate-900 uppercase">My Wishlist</h1>
        <p className="text-xs text-slate-500">Your favorite styles and saved garments</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your wishlist is empty</h2>
          <p className="text-xs text-slate-500">
            Click the heart icon on any apparel card to save it for later.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[3/4] bg-slate-100">
                <img src={p.primaryImage} alt={p.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <Link href={`/product/${p.slug}`} className="text-xs font-bold text-slate-900 hover:text-amber-600 transition line-clamp-1 block">
                  {p.name}
                </Link>
                <div className="text-sm font-black text-slate-900">
                  {formatPrice(p.salePrice || p.basePrice, theme.currencySymbol)}
                </div>
                <button
                  onClick={() => {
                    addItem({
                      productId: p.id,
                      name: p.name,
                      price: parseFloat(p.salePrice || p.basePrice),
                      regularPrice: parseFloat(p.basePrice),
                      image: p.primaryImage,
                      quantity: 1,
                      size: "M",
                      colorName: "Standard"
                    });
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
