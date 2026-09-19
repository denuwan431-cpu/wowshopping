"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Filter,
  X,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Grid3X3,
  LayoutGrid
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { formatPrice } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

interface ShopClientProps {
  initialProducts: any[];
  categories: any[];
  initialCategory?: string;
  initialSearch?: string;
  initialSale?: boolean;
}

export function ShopClient({
  initialProducts,
  categories,
  initialCategory = "all",
  initialSearch = "",
  initialSale = false
}: ShopClientProps) {
  const { theme } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [saleOnly, setSaleOnly] = useState<boolean>(initialSale);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [columns, setColumns] = useState<3 | 4>(4);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const availableSizes = [
    "Month 6-18",
    "Year 2-3",
    "Year 4-5",
    "Year 6-7",
    "Year 8-9",
    "S",
    "M",
    "L",
    "XL",
    "XXL"
  ];

  const availableColors = [
    { name: "Black", hex: "#0f172a" },
    { name: "White", hex: "#f8fafc" },
    { name: "Green", hex: "#15803d" },
    { name: "Pink", hex: "#f472b6" },
    { name: "Blue", hex: "#0284c7" },
    { name: "Yellow", hex: "#f59e0b" }
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    let prods = [...initialProducts];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== "all") {
      const catObj = categories.find((c) => c.slug === selectedCategory);
      if (catObj) {
        prods = prods.filter((p) => p.categoryId === catObj.id);
      }
    }

    // Sale
    if (saleOnly) {
      prods = prods.filter(
        (p) => p.salePrice && parseFloat(p.salePrice) < parseFloat(p.basePrice)
      );
    }

    // Stock
    if (inStockOnly) {
      prods = prods.filter((p) => (p.stockQuantity ?? 50) > 0);
    }

    // Price
    if (minPrice) {
      const min = parseFloat(minPrice);
      prods = prods.filter((p) => parseFloat(p.salePrice || p.basePrice) >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      prods = prods.filter((p) => parseFloat(p.salePrice || p.basePrice) <= max);
    }

    // Size attribute
    if (selectedSize) {
      prods = prods.filter((p) => {
        const sizes = p.attributes?.Size;
        return Array.isArray(sizes) && sizes.includes(selectedSize);
      });
    }

    // Color attribute
    if (selectedColor) {
      prods = prods.filter((p) => {
        const colors = p.attributes?.Color;
        return (
          Array.isArray(colors) &&
          colors.some((c) => c.toLowerCase().includes(selectedColor.toLowerCase()))
        );
      });
    }

    // Sorting
    if (sortBy === "price_asc") {
      prods.sort(
        (a, b) =>
          parseFloat(a.salePrice || a.basePrice) -
          parseFloat(b.salePrice || b.basePrice)
      );
    } else if (sortBy === "price_desc") {
      prods.sort(
        (a, b) =>
          parseFloat(b.salePrice || b.basePrice) -
          parseFloat(a.salePrice || a.basePrice)
      );
    } else if (sortBy === "best_selling") {
      prods.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortBy === "highest_rated") {
      prods.sort(
        (a, b) =>
          parseFloat(b.ratingAverage || "0") - parseFloat(a.ratingAverage || "0")
      );
    }

    return prods;
  }, [
    initialProducts,
    searchQuery,
    selectedCategory,
    saleOnly,
    inStockOnly,
    minPrice,
    maxPrice,
    selectedSize,
    selectedColor,
    sortBy,
    categories
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSaleOnly(false);
    setInStockOnly(false);
    setSelectedSize("");
    setSelectedColor("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchQuery !== "" ||
    saleOnly ||
    inStockOnly ||
    selectedSize !== "" ||
    selectedColor !== "" ||
    minPrice !== "" ||
    maxPrice !== "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-slate-900 transition">
          Shop Catalog
        </Link>
        {selectedCategory !== "all" && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold capitalize">
              {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
            </span>
          </>
        )}
      </div>

      {/* Page Title & Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 uppercase tracking-tight">
            {selectedCategory === "all"
              ? "All Garments & Apparel"
              : categories.find((c) => c.slug === selectedCategory)?.name || "Apparel"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredProducts.length} curated fashion items
          </p>
        </div>

        {/* Sorting & Layout Toggles */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 bg-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasActiveFilters && "•"}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="hidden sm:inline">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="newest">Newest Drops</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="best_selling">Best Selling</option>
              <option value="highest_rated">Highest Rated</option>
            </select>
          </div>

          {/* Desktop Grid Columns Toggle */}
          <div className="hidden sm:flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setColumns(3)}
              className={`p-2 transition ${columns === 3 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              title="3 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`p-2 transition ${columns === 4 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              title="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Active Filters:</span>
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white font-semibold">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory("all")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {saleOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white font-semibold">
              Sale Items
              <button onClick={() => setSaleOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedSize && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-semibold">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize("")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedColor && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-semibold">
              Color: {selectedColor}
              <button onClick={() => setSelectedColor("")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-semibold">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery("")}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-amber-600 hover:underline font-bold flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Categories
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left py-1.5 px-2.5 rounded-md font-semibold transition ${
                    selectedCategory === "all"
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md font-semibold transition ${
                      selectedCategory === cat.slug
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Filters */}
          <div className="border-t border-slate-100 pt-5 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Special Offers
            </h3>
            <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={saleOnly}
                onChange={(e) => setSaleOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>On Sale Only</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Sizes */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Size
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition ${
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

          {/* Colors */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Color Tone
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(selectedColor === c.name ? "" : c.name)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full border-2 transition relative ${
                    selectedColor === c.name ? "border-amber-500 scale-110 shadow-sm" : "border-slate-200"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Price Range ({theme.currencySymbol})
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full py-2.5 border border-slate-300 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Reset All Filters
            </button>
          )}
        </aside>

        {/* Product Grid Area */}
        <main className="col-span-1 lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing size and color filters to see more apparel items.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 ${
                columns === 4
                  ? "sm:grid-cols-3 xl:grid-cols-4"
                  : "sm:grid-cols-2 xl:grid-cols-3"
              } gap-4 sm:gap-6`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Slide-Out Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Filter Products
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Category
                </h4>
                <div className="flex flex-col gap-1 text-xs">
                  <button
                    onClick={() => { setSelectedCategory("all"); setMobileFilterOpen(false); }}
                    className={`text-left py-1.5 px-2 rounded font-semibold ${selectedCategory === "all" ? "bg-slate-900 text-white" : "text-slate-700"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.slug); setMobileFilterOpen(false); }}
                      className={`text-left py-1.5 px-2 rounded font-semibold ${selectedCategory === c.slug ? "bg-slate-900 text-white" : "text-slate-700"}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special options */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(e) => setSaleOnly(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>On Sale Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Sizes */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Size
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded border ${selectedSize === s ? "bg-slate-900 text-white" : "bg-white text-slate-700 border-slate-200"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-md text-xs font-bold uppercase"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold uppercase"
              >
                View ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
