"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Share2,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { formatPrice } from "@/lib/utils";

interface ProductDetailProps {
  product: any;
  variants: any[];
  initialReviews: any[];
}

export function ProductDetailClient({
  product,
  variants,
  initialReviews
}: ProductDetailProps) {
  const router = useRouter();
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { theme } = useTheme();

  const galleryList = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.primaryImage, product.secondaryImage || product.primaryImage].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Available attributes
  const sizes = product.attributes?.Size || ["Month 6-18", "Year 2-3", "Year 4-5", "S", "M", "L", "XL"];
  const colors = product.attributes?.Color || ["Forest Green", "Dusty Pink", "Navy Blue"];

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "sizing" | "reviews">("description");

  // Review submission state
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [reviewName, setReviewName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [isAdded, setIsAdded] = useState(false);

  // Find matching variant
  const activeVariant = variants.find(
    (v) => v.size === selectedSize && v.colorName.toLowerCase() === selectedColor.toLowerCase()
  );

  const basePriceNum = Number(product.basePrice);
  const salePriceNum = activeVariant?.salePrice
    ? Number(activeVariant.salePrice)
    : product.salePrice
    ? Number(product.salePrice)
    : null;

  const currentPrice = salePriceNum !== null && salePriceNum < basePriceNum ? salePriceNum : basePriceNum;
  const hasSale = salePriceNum !== null && salePriceNum < basePriceNum;
  const discountPercent = hasSale ? Math.round(((basePriceNum - salePriceNum) / basePriceNum) * 100) : 0;

  const inWishlist = isInWishlist(product.id);
  const currentSku = activeVariant?.sku || product.sku;
  const currentStock = activeVariant?.stockQuantity ?? product.stockQuantity ?? 50;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addItem({
      productId: product.id,
      variantId: activeVariant?.id || null,
      name: product.name,
      variantTitle: `${selectedSize} / ${selectedColor}`,
      size: selectedSize,
      colorName: selectedColor,
      price: currentPrice,
      regularPrice: basePriceNum,
      image: galleryList[activeImageIndex] || product.primaryImage,
      quantity
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        setReviewsList([data.review, ...reviewsList]);
        setReviewSuccess(true);
        setReviewTitle("");
        setReviewComment("");
      }
    } catch {
      alert("Error submitting review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-slate-900 transition">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={galleryList[activeImageIndex] || product.primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {hasSale && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
            <div className="absolute bottom-4 right-4 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
              {activeImageIndex + 1} / {galleryList.length}
            </div>
          </div>

          {/* Thumbnails rail */}
          {galleryList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryList.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImageIndex === idx ? "border-amber-500 shadow-md" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Configurator & Purchasing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">SKU: <strong className="text-slate-800">{currentSku}</strong></span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                <Check className="w-3 h-3" />
                {currentStock > 0 ? "In Stock (Islandwide Dispatch)" : "Available on Backorder"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900">{Number(product.ratingAverage || 5).toFixed(1)}</span>
              <span className="text-slate-500">({reviewsList.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-slate-950 font-heading">
                {formatPrice(currentPrice, theme.currencySymbol)}
              </span>
              {hasSale && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(basePriceNum, theme.currencySymbol)}
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
              Color Tone: <strong className="text-amber-600">{selectedColor}</strong>
            </span>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                    selectedColor === c
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-900">
                Garment Size: <strong className="text-amber-600">{selectedSize}</strong>
              </span>
              <Link href="/size-guide" className="text-amber-600 font-bold hover:underline">
                Size Chart & Measurements
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    selectedSize === s
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">QUANTITY</span>
              <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    ADDED TO SHOPPING BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    ADD TO BAG
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-md whitespace-nowrap"
              >
                BUY NOW
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-center transition ${
                  inWishlist
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Delivery & Security Assurance Badges */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span><strong>Islandwide Delivery:</strong> Colombo 1-2 days, Outer regions 2-4 business days.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span><strong>Hassle-Free Exchanges:</strong> 7 days return & exchange window if sizing isn't perfect.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span><strong>Guaranteed Quality:</strong> 100% natural combed cotton & industrial DTF durability.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Sizing, Reviews */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 border-b-2 transition ${
              activeTab === "description"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`pb-3 border-b-2 transition ${
              activeTab === "specifications"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Fabric & Specs
          </button>
          <button
            onClick={() => setActiveTab("sizing")}
            className={`pb-3 border-b-2 transition ${
              activeTab === "sizing"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Size Guide
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 border-b-2 transition ${
              activeTab === "reviews"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Customer Reviews ({reviewsList.length})
          </button>
        </div>

        <div className="py-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          {activeTab === "description" && (
            <div className="max-w-3xl space-y-4">
              <p>{product.description}</p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">Product Highlights:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Premium ring-spun combed cotton weave for ultra-soft hand feel.</li>
                  <li>Flatlock reinforced seams preventing skin chafing in warm climates.</li>
                  <li>Industrial 8-color DTF pigment transfer with 50+ wash longevity.</li>
                  <li>Non-toxic azo-free eco dyes safe for delicate infant skin.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="flex justify-between p-3 bg-slate-50 font-semibold">
                <span className="text-slate-500">Fabric Composition</span>
                <span className="text-slate-900">100% Combed Cotton / Single Jersey</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">Fabric Weight</span>
                <span className="text-slate-900">180 – 240 GSM</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 font-semibold">
                <span className="text-slate-500">Print Technology</span>
                <span className="text-slate-900">Direct-To-Film (DTF) Pigment Transfer</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">Fit Silhouette</span>
                <span className="text-slate-900">Modern Casual Comfort Fit</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 font-semibold">
                <span className="text-slate-500">Wash Care</span>
                <span className="text-slate-900">Machine wash cold inside-out, tumble dry low, do not iron on print</span>
              </div>
            </div>
          )}

          {activeTab === "sizing" && (
            <div className="max-w-2xl space-y-4">
              <p className="text-slate-600">
                All measurements are in inches. For a looser streetwear fit, we recommend ordering one size up.
              </p>
              <table className="w-full border-collapse border border-slate-200 text-center text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-200 p-2.5">Size</th>
                    <th className="border border-slate-200 p-2.5">Chest (Inches)</th>
                    <th className="border border-slate-200 p-2.5">Length (Inches)</th>
                    <th className="border border-slate-200 p-2.5">Recommended Age/Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="border border-slate-200 p-2 font-bold">Month 6-18</td>
                    <td className="border border-slate-200 p-2">20 - 22"</td>
                    <td className="border border-slate-200 p-2">14"</td>
                    <td className="border border-slate-200 p-2">Infant</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 font-bold">Year 2-3</td>
                    <td className="border border-slate-200 p-2">24"</td>
                    <td className="border border-slate-200 p-2">16"</td>
                    <td className="border border-slate-200 p-2">Toddler</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 font-bold">Year 4-5</td>
                    <td className="border border-slate-200 p-2">26"</td>
                    <td className="border border-slate-200 p-2">18"</td>
                    <td className="border border-slate-200 p-2">Kids</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 font-bold">M (Adults)</td>
                    <td className="border border-slate-200 p-2">40"</td>
                    <td className="border border-slate-200 p-2">28"</td>
                    <td className="border border-slate-200 p-2">Standard Adult</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 font-bold">L (Adults)</td>
                    <td className="border border-slate-200 p-2">42"</td>
                    <td className="border border-slate-200 p-2">29"</td>
                    <td className="border border-slate-200 p-2">Standard Adult</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 font-bold">XL (Adults)</td>
                    <td className="border border-slate-200 p-2">44"</td>
                    <td className="border border-slate-200 p-2">30"</td>
                    <td className="border border-slate-200 p-2">Boxy Streetwear</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Existing Reviews */}
              <div className="md:col-span-7 space-y-4">
                {reviewsList.length === 0 ? (
                  <p className="text-slate-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                  reviewsList.map((rev: any) => (
                    <div key={rev.id || Math.random()} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rev.customerName}</span>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs">{rev.title}</h5>
                      <p className="text-xs text-slate-600">{rev.comment}</p>
                      {rev.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-700 font-semibold">
                          <Check className="w-3 h-3 text-green-600" /> Verified Buyer
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Write a Customer Review
                </h4>
                {reviewSuccess ? (
                  <div className="p-4 bg-green-100 text-green-800 text-xs rounded-lg font-semibold">
                    Thank you! Your verified review has been published.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Star Rating</label>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setReviewRating(s)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star className={`w-5 h-5 ${s <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Review Headline *"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      placeholder="Your feedback on fabric quality, sizing, and comfort..."
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs uppercase rounded-md hover:bg-slate-800 transition"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
