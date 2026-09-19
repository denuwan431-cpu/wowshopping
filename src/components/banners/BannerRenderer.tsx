"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, Check, Scissors, ShoppingBag, ShieldCheck } from "lucide-react";

export interface BannerData {
  id: number;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  styleKey: string;
  desktopImage: string;
  mobileImage?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaUrl?: string | null;
  bgColor?: string | null;
  textColor?: string | null;
  textAlign?: string | null;
  textPosition?: string | null;
  overlayOpacity?: number | null;
  videoUrl?: string | null;
  posterUrl?: string | null;
}

export function BannerRenderer({ banner }: { banner: BannerData }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ctaUrl = banner.ctaUrl || "/shop";
  const ctaText = banner.ctaText || "Shop Collection";

  switch (banner.styleKey) {
    // Style 01: Full-width Editorial Hero
    case "style_01":
      return (
        <div className="relative w-full h-[520px] md:h-[620px] bg-slate-950 overflow-hidden text-white flex items-center">
          {banner.videoUrl ? (
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster={banner.posterUrl || banner.desktopImage}>
              <source src={banner.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: `url(${banner.desktopImage})` }} />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent"
            style={{ opacity: (banner.overlayOpacity || 45) / 100 }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-4">
              {banner.badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white border border-white/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {banner.badge}
                </span>
              )}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white uppercase font-heading">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-light">
                  {banner.subtitle}
                </p>
              )}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm transition-all duration-200 bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg hover:shadow-xl"
                >
                  {ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {banner.secondaryCtaText && (
                  <Link
                    href={banner.secondaryCtaUrl || "/shop"}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm transition-all duration-200 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25"
                  >
                    {banner.secondaryCtaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    // Style 02: Split Image / Text Editorial
    case "style_02":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="p-8 sm:p-12 flex flex-col justify-center space-y-4 bg-slate-900 text-white">
              {banner.badge && (
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {banner.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-4xl font-bold font-heading">{banner.title}</h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{banner.subtitle}</p>
              <div className="pt-4">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-semibold text-sm rounded-md hover:bg-amber-400 transition"
                >
                  {ctaText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto min-h-[300px]">
              <img
                src={banner.desktopImage}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      );

    // Style 03: Centered Campaign with Frosted Backdrop
    case "style_03":
      return (
        <div className="relative w-full py-20 px-4 flex items-center justify-center bg-slate-900 overflow-hidden">
          <img
            src={banner.desktopImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="relative max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 text-white space-y-4 shadow-2xl">
            {banner.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500 text-slate-950 inline-block">
                {banner.badge}
              </span>
            )}
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-heading">{banner.title}</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">{banner.subtitle}</p>
            <div className="pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-bold rounded-md hover:bg-slate-100 transition shadow-lg"
              >
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      );

    // Style 04: Left Text / Right Product Cut-out
    case "style_04":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-900/40">
            <div className="space-y-3 max-w-lg">
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">{banner.badge || "FEATURED COLLECTION"}</span>
              <h3 className="text-2xl sm:text-4xl font-bold font-heading">{banner.title}</h3>
              <p className="text-slate-300 text-sm">{banner.subtitle}</p>
              <div className="pt-2">
                <Link href={ctaUrl} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-md hover:bg-teal-400 transition">
                  {ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img src={banner.desktopImage} alt="" className="rounded-xl shadow-2xl max-h-[320px] object-cover border border-white/10" />
            </div>
          </div>
        </div>
      );

    // Style 05: Right Text / Left Garment Showcase
    case "style_05":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-slate-100 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row-reverse items-center justify-between gap-8 border border-slate-200">
            <div className="space-y-3 max-w-lg">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-600">{banner.badge || "LIMITED DROP"}</span>
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 font-heading">{banner.title}</h3>
              <p className="text-slate-600 text-sm">{banner.subtitle}</p>
              <div className="pt-2">
                <Link href={ctaUrl} className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-slate-800 transition">
                  {ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img src={banner.desktopImage} alt="" className="rounded-xl shadow-lg max-h-[320px] object-cover" />
            </div>
          </div>
        </div>
      );

    // Style 06: Minimal High-Fashion Monochrome
    case "style_06":
      return (
        <div className="border-y border-slate-200 bg-white py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{banner.badge || "EDITORIAL"}</span>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 uppercase font-heading">{banner.title}</h2>
              <p className="text-sm text-slate-500 max-w-xl">{banner.subtitle}</p>
            </div>
            <Link href={ctaUrl} className="px-6 py-3 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition font-medium text-xs uppercase tracking-widest">
              {ctaText}
            </Link>
          </div>
        </div>
      );

    // Style 07: Dark Campaign Banner
    case "style_07":
      return (
        <div className="relative py-14 px-4 bg-slate-950 text-white border-y border-amber-500/20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{banner.badge || "MIDNIGHT CAMPAIGN"}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-heading">{banner.title}</h2>
              <p className="text-slate-400 text-sm max-w-lg">{banner.subtitle}</p>
            </div>
            <Link href={ctaUrl} className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded hover:bg-amber-400 transition shadow-lg shadow-amber-500/10">
              {ctaText}
            </Link>
          </div>
        </div>
      );

    // Style 08: Bright Seasonal Banner
    case "style_08":
      return (
        <div className="bg-amber-500 text-slate-950 py-10 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-slate-950 text-white px-2 py-0.5 rounded mr-2">{banner.badge || "SEASON DROP"}</span>
              <span className="text-lg sm:text-xl font-bold uppercase">{banner.title}</span>
              {banner.subtitle && <p className="text-xs sm:text-sm text-slate-900 mt-1">{banner.subtitle}</p>}
            </div>
            <Link href={ctaUrl} className="px-5 py-2.5 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-800 transition whitespace-nowrap">
              {ctaText}
            </Link>
          </div>
        </div>
      );

    // Style 09: Collection Showcase with Multi-thumbnail preview
    case "style_09":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-8 md:p-12">
            <img src={banner.desktopImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400">{banner.badge || "CURATED CAPSULE"}</span>
              <h3 className="text-3xl font-bold font-heading">{banner.title}</h3>
              <p className="text-slate-300 text-sm">{banner.subtitle}</p>
              <div className="pt-2">
                <Link href={ctaUrl} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-md hover:bg-teal-400 transition">
                  {ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );

    // Style 10: Product Spotlight with Circular Discount Badge
    case "style_10":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">{banner.badge || "SPOTLIGHT ITEM"}</span>
              <h3 className="text-2xl font-bold font-heading">{banner.title}</h3>
              <p className="text-slate-300 text-sm">{banner.subtitle}</p>
              <Link href={ctaUrl} className="inline-block mt-3 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs uppercase rounded hover:bg-amber-400 transition">
                {ctaText}
              </Link>
            </div>
            <div className="relative">
              <img src={banner.desktopImage} alt="" className="w-64 h-64 object-cover rounded-xl shadow-xl" />
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-red-600 text-white flex flex-col items-center justify-center font-bold text-xs shadow-lg transform rotate-12">
                <span>SAVE</span>
                <span className="text-sm">25%</span>
              </div>
            </div>
          </div>
        </div>
      );

    // Style 11: Three-Card Promotional Banner Grid
    case "style_11":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-between h-48 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase">KIDS COLLECTION</span>
                <h4 className="text-lg font-bold mt-1">Cozy Combed Pajamas</h4>
              </div>
              <Link href="/shop?category=kids-pajamas" className="text-xs font-semibold text-amber-400 flex items-center gap-1 hover:underline">
                Explore Pajamas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-amber-500 text-slate-950 p-6 rounded-xl flex flex-col justify-between h-48">
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase">FREE DELIVERY</span>
                <h4 className="text-lg font-bold mt-1">Islandwide Orders 5+ Items</h4>
              </div>
              <Link href="/shop" className="text-xs font-bold text-slate-950 flex items-center gap-1 hover:underline">
                Shop Essentials <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-slate-950 text-white p-6 rounded-xl flex flex-col justify-between h-48 border border-teal-500/30">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase">DTF PRINTING</span>
                <h4 className="text-lg font-bold mt-1">Print Custom T-Shirts</h4>
              </div>
              <Link href="/dtf-printing" className="text-xs font-semibold text-teal-400 flex items-center gap-1 hover:underline">
                Launch DTF Studio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      );

    // Style 12: Category Banner
    case "style_12":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative rounded-2xl overflow-hidden h-56 bg-slate-900 flex items-center justify-center text-center p-6 text-white">
            <img src={banner.desktopImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">{banner.badge || "CATEGORY HIGHLIGHT"}</span>
              <h2 className="text-3xl font-extrabold uppercase font-heading">{banner.title}</h2>
              <div className="pt-2">
                <Link href={ctaUrl} className="px-5 py-2 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded hover:bg-slate-100 transition inline-block">
                  {ctaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      );

    // Style 13: Discount Campaign Banner with Coupon Copy Action
    case "style_13":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
                {banner.badge || "SPECIAL CAMPAIGN"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">{banner.title}</h3>
              <p className="text-amber-100 text-sm max-w-lg">{banner.subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleCopyCode("AURA10")}
                className="flex items-center gap-2 px-4 py-3 bg-white text-slate-900 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-amber-50 transition shadow"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Sparkles className="w-4 h-4 text-amber-600" />}
                {copied ? "CODE COPIED!" : "COPY CODE: AURA10"}
              </button>
              <Link
                href={ctaUrl}
                className="px-5 py-3 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-slate-800 transition"
              >
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      );

    // Style 14: New Arrival Editorial Banner
    case "style_14":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border border-slate-200 rounded-2xl p-8 bg-stone-50 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">2026 EDITION</span>
              <h3 className="text-3xl sm:text-4xl font-serif text-stone-900">{banner.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{banner.subtitle}</p>
              <div className="pt-2">
                <Link href={ctaUrl} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-950 border-b-2 border-stone-950 pb-1 hover:text-amber-600 hover:border-amber-600 transition">
                  {ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <img src={banner.desktopImage} alt="" className="rounded-xl shadow-md max-h-[300px] w-full object-cover" />
            </div>
          </div>
        </div>
      );

    // Style 15: Custom DTF Printing Showcase Banner
    case "style_15":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 text-white p-6 sm:p-12">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${banner.desktopImage})` }}
            />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Scissors className="w-3.5 h-3.5 text-teal-400" />
                {banner.badge || "BESPOKE DTF PRINT STUDIO"}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading">
                {banner.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {banner.subtitle || "Send us your PNG, JPG, or SVG graphics. Experience commercial-grade direct-to-film transfer technology starting from Rs. 650/=. 50+ wash durability guaranteed."}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/dtf-printing"
                  className="px-6 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider bg-teal-500 text-slate-950 hover:bg-teal-400 transition shadow-lg"
                >
                  START CUSTOM PRINT ORDER
                </Link>
                <Link
                  href="/shop?category=dtf-printing"
                  className="px-5 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-sm border border-white/20"
                >
                  BROWSE DTF APPAREL
                </Link>
              </div>
            </div>
          </div>
        </div>
      );

    // Style 16: Kids Collection Playful Banner
    case "style_16":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-md">
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
                {banner.badge || "KIDS SLEEPWEAR"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">{banner.title}</h3>
              <p className="text-slate-600 text-sm">{banner.subtitle}</p>
              <div className="pt-2">
                <Link href={ctaUrl} className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-sky-700 transition inline-block shadow-sm">
                  {ctaText}
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img src={banner.desktopImage} alt="" className="rounded-xl shadow max-h-[280px] object-cover" />
            </div>
          </div>
        </div>
      );

    // Style 17: Adults Minimal Architectural Banner
    case "style_17":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">UNISEX ESSENTIALS // 2026</span>
              <h3 className="text-3xl font-bold font-heading">{banner.title}</h3>
              <p className="text-slate-400 text-sm">{banner.subtitle}</p>
              <div className="pt-2">
                <Link href={ctaUrl} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded hover:bg-slate-100 transition">
                  {ctaText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <img src={banner.desktopImage} alt="" className="rounded-lg max-h-[260px] object-cover shadow-2xl border border-white/10" />
          </div>
        </div>
      );

    // Style 18: Limited-Time Offer with Stock Progress
    case "style_18":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-950 border border-red-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>LIMITED TIME FLASH DROP</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">{banner.title}</h3>
              <p className="text-red-200 text-sm max-w-lg">{banner.subtitle}</p>
              <div className="w-64 bg-red-900/60 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-red-500 h-full w-3/4 rounded-full" />
              </div>
              <span className="text-xs text-red-300 block">75% Claimed - Only a few units remaining</span>
            </div>
            <Link href={ctaUrl} className="px-6 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-red-500 transition shadow-lg whitespace-nowrap">
              {ctaText}
            </Link>
          </div>
        </div>
      );

    // Style 19: Editorial Magazine-Style Banner
    case "style_19":
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            <div className="md:col-span-1 hidden md:flex items-center justify-center">
              <span className="transform -rotate-90 text-xs font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap">
                AURA ATELIER NO. 04
              </span>
            </div>
            <div className="md:col-span-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">{banner.badge || "EDITORIAL"}</span>
              <h3 className="text-2xl sm:text-4xl font-serif text-slate-900">{banner.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{banner.subtitle}</p>
              <div className="pt-2">
                <Link href={ctaUrl} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition">
                  {ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="md:col-span-5">
              <img src={banner.desktopImage} alt="" className="rounded-lg object-cover h-[300px] w-full shadow-sm" />
            </div>
          </div>
        </div>
      );

    // Style 20: Minimal Typography Banner with Bold Letters
    case "style_20":
    default:
      return (
        <div className="bg-slate-900 text-white py-12 px-4 border-y border-slate-800">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">{banner.badge || "EXPRESSIVE STREETWEAR"}</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-heading">{banner.title}</h2>
            {banner.subtitle && <p className="text-slate-300 text-sm max-w-2xl mx-auto">{banner.subtitle}</p>}
            <div className="pt-3">
              <Link href={ctaUrl} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded hover:bg-slate-100 transition shadow">
                {ctaText} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      );
  }
}
