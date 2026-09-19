"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  ArrowRight,
  Scissors,
  Sparkles,
  ChevronRight,
  Flame,
  Star
} from "lucide-react";
import { BannerRenderer, BannerData } from "@/components/banners/BannerRenderer";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { formatPrice } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

interface HomeClientProps {
  banners: BannerData[];
  kidsProducts: any[];
  pajamaProducts: any[];
  skinnyProducts: any[];
  adultsProducts: any[];
  dtfProducts: any[];
  categories: any[];
}

export function HomeClient({
  banners,
  kidsProducts,
  pajamaProducts,
  skinnyProducts,
  adultsProducts,
  dtfProducts,
  categories
}: HomeClientProps) {
  const { theme } = useTheme();
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroBanners = banners.length > 0 ? banners : [];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner Slider */}
      {(heroBanners.length > 0 || theme.siteConfig?.heroVideoEnabled) && (
        <section className="relative">
          {theme.siteConfig?.heroVideoEnabled && theme.siteConfig?.heroVideoUrl ? (
            <div className="relative w-full min-h-[280px] sm:min-h-[430px] overflow-hidden bg-slate-950">
              <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster={theme.siteConfig.heroVideoPoster || undefined}>
                <source src={theme.siteConfig.heroVideoUrl} />
              </video>
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 min-h-[280px] sm:min-h-[430px] flex items-center justify-center p-6 text-white text-center">
                <div><div className="text-xs uppercase tracking-[0.25em] font-black">{heroBanners[activeHeroIndex]?.badge || theme.storeName}</div><h1 className="text-3xl sm:text-6xl font-black mt-2">{heroBanners[activeHeroIndex]?.title || theme.tagline}</h1><p className="max-w-2xl mx-auto mt-3 text-sm sm:text-base">{heroBanners[activeHeroIndex]?.subtitle || theme.brandDescription}</p></div>
              </div>
            </div>
          ) : <BannerRenderer banner={heroBanners[activeHeroIndex]} />}
          {heroBanners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeHeroIndex === idx
                      ? "bg-amber-400 w-8"
                      : "bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. Commercial Support & Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Islandwide Delivery</h4>
              <p className="text-[11px] text-slate-500">Free over {formatPrice(theme.freeShippingThreshold, theme.currencySymbol)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Secure Payments</h4>
              <p className="text-[11px] text-slate-500">Card, Koko BNPL, COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">WhatsApp Hotline</h4>
              <p className="text-[11px] text-slate-500">{theme.whatsapp}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Easy Exchanges</h4>
              <p className="text-[11px] text-slate-500">Hassle-free 7-day policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visual Category Navigation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Shop by Department
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore curated collections for the whole family</p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            All Collections <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug === "dtf-printing" ? "/dtf-printing" : `/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 border border-slate-200/80 shadow-xs flex flex-col justify-end p-5"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  COLLECTION
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-200 group-hover:text-amber-300 transition">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Latest Kids' Pajamas Section */}
      {pajamaProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Latest Kids Pajamas
              </h2>
              <p className="text-xs text-slate-500">100% natural combed cotton sets for dream-filled sleep</p>
            </div>
            <Link
              href="/shop?category=kids-pajamas"
              className="text-xs font-bold text-slate-700 hover:text-amber-600 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {pajamaProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Custom DTF Printing Big Commercial Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 text-white p-8 sm:p-12 lg:p-16">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/27893026/pexels-photo-27893026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600')"
            }}
          />
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Scissors className="w-3.5 h-3.5 text-teal-400" />
              DIRECT-TO-FILM TECHNOLOGY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading leading-tight">
              PRINT YOUR OWN DESIGN WITH DTF
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Upload your high-res JPG, PNG, or vector graphics and get them printed from as little as <strong>Rs. 650/=</strong>. No minimum order quantity, premium garments, and industry-leading wash resistance.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/dtf-printing"
                className="px-6 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-teal-500 text-slate-950 hover:bg-teal-400 transition shadow-lg shadow-teal-500/20 flex items-center gap-2"
              >
                Launch DTF Customizer
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?category=dtf-printing"
                className="px-5 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-md border border-white/20"
              >
                View DTF Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Latest Kids Skinny & Tank Tops */}
      {skinnyProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Latest Kids Skinny & Tanks
              </h2>
              <p className="text-xs text-slate-500">Breathable sleeveless cotton outfits for active play</p>
            </div>
            <Link
              href="/shop?category=tank-skinny-tops"
              className="text-xs font-bold text-slate-700 hover:text-amber-600 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {skinnyProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Latest Adults Unisex T-Shirts */}
      {adultsProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Latest Adults Unisex T-Shirts
              </h2>
              <p className="text-xs text-slate-500">240 GSM heavy combed cotton drops and tailored streetwear</p>
            </div>
            <Link
              href="/shop?category=adults"
              className="text-xs font-bold text-slate-700 hover:text-amber-600 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {adultsProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. DTF Artist Graphic Series */}
      {dtfProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Latest DTF Graphic T-Shirts
              </h2>
              <p className="text-xs text-slate-500">High-pigment colorfast prints that never crack or fade</p>
            </div>
            <Link
              href="/shop?category=dtf-printing"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {dtfProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        {theme.siteConfig?.bottomBanner?.enabled && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12" style={{background:theme.siteConfig.bottomBanner.bgColor||'var(--primary)',color:theme.siteConfig.bottomBanner.textColor||'#fff'}}>
            {theme.siteConfig.bottomBanner.imageUrl&&<img src={theme.siteConfig.bottomBanner.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25"/>}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              {theme.siteConfig.bottomBanner.showText!==false&&<div><h2 className="text-2xl sm:text-3xl font-black">{theme.siteConfig.bottomBanner.title}</h2><p className="mt-1 opacity-80 text-sm">{theme.siteConfig.bottomBanner.subtitle}</p></div>}
              {theme.siteConfig.bottomBanner.showButton!==false&&<Link href={theme.siteConfig.bottomBanner.buttonUrl||'/shop'} className="shrink-0 px-5 py-3 rounded-xl bg-white text-slate-950 text-xs font-black uppercase">{theme.siteConfig.bottomBanner.buttonText||'Shop Now'}</Link>}
            </div>
          </div>
        </section>
      )}

      <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
