"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Phone,
  ChevronDown,
  Sparkles,
  Scissors,
  Flame,
  Home,
  Layers,
  ArrowRight
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { formatPrice } from "@/lib/utils";

interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  basePrice: string;
  salePrice?: string;
  primaryImage: string;
  categoryName?: string;
}

function flattenMenu(items:any[], out:any[]=[]):any[]{items.forEach((x:any)=>{if(x.visible){const match=x.href?.match(/category=([^&]+)/); if(match) out.push({value:match[1],label:x.label}); if(x.children) flattenMenu(x.children,out);}}); return out;}

function MenuNode({ item, level = 0 }: { item: any; level?: number }) {
  const children = (item.children || []).filter((c: any) => c.visible);
  return <div className={`relative ${level === 0 ? "group" : ""}`}>
    <Link href={item.href || "/shop"} className={`flex items-center gap-1 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:text-slate-950 transition ${level>0 ? "justify-between rounded-lg hover:bg-slate-50" : ""}`}>
      <span>{item.label}</span>{children.length>0 && <ChevronDown className={`w-3.5 h-3.5 ${level===0?"group-hover:rotate-180":""} transition-transform`} />}
    </Link>
    {children.length>0 && <div className={`${level===0?"absolute left-0 top-full hidden group-hover:block":"absolute left-full top-0 hidden group-hover:block"} min-w-52 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50`}>{children.map((c:any)=><MenuNode key={c.id} item={c} level={level+1}/>)}</div>}
  </div>;
}

function MobileMenuNode({ item, close, level = 0 }: { item:any; close:()=>void; level?:number }) {
  const [open,setOpen]=useState(false); const children=(item.children||[]).filter((c:any)=>c.visible);
  return <div><div className={`flex items-center ${level>0?'pl-4':''}`}><Link href={item.href||'/shop'} onClick={close} className="flex-1 py-3 text-sm font-semibold border-b border-slate-100">{item.label}</Link>{children.length>0&&<button onClick={()=>setOpen(!open)} className="p-3 border-b border-slate-100"><ChevronDown className={`w-4 h-4 transition-transform ${open?'rotate-180':''}`}/></button>}</div>{open&&children.map((c:any)=><MobileMenuNode key={c.id} item={c} close={close} level={level+1}/>)}</div>;
}

export function Header() {
  const router = useRouter();
  const { totalCount, subtotal, openCart, wishlist } = useCart();
  const { theme } = useTheme();

  const [announcementClosed, setAnnouncementClosed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced AJAX search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const catParam = searchCategory !== "all" ? `&category=${searchCategory}` : "";
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}${catParam}&limit=6`);
        const data = await res.json();
        if (data.products) {
          setSearchResults(data.products);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, searchCategory]);

  // Click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchDropdown(false);
    const catQuery = searchCategory !== "all" ? `&category=${searchCategory}` : "";
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}${catQuery}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* Dynamic Announcement Bar */}
      {theme.announcementEnabled && !announcementClosed && (
        <div className="bg-slate-950 text-white text-[11px] sm:text-xs font-medium py-2 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1 text-center truncate pr-2">
              <span className="tracking-wide">
                {theme.announcementText}
              </span>
              {theme.announcementCta && (
                <Link
                  href={theme.announcementLink || "/shop"}
                  className="ml-2 font-bold text-amber-400 hover:underline uppercase"
                >
                  {theme.announcementCta} →
                </Link>
              )}
            </div>
            <button
              onClick={() => setAnnouncementClosed(true)}
              className="text-slate-400 hover:text-white p-0.5"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header Strip */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo / Brand Name */}
          <Link href="/" className="flex flex-col items-start">
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt={theme.storeName} className="h-10 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-black text-sm tracking-tighter shadow-sm">
                  A
                </span>
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-heading block leading-none">
                    {theme.storeName}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block mt-0.5">
                    STUDIO & ATELIER
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Search Bar with Category Dropdown (Desktop) */}
          <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xl mx-4 relative">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-slate-100/90 rounded-lg border border-slate-200 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 overflow-hidden"
            >
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="appearance-none bg-white text-xs font-bold text-slate-700 py-2.5 pl-3 pr-8 border-r border-slate-200 focus:outline-none cursor-pointer rounded-l-lg"
              >
                <option value="all">All Categories</option>
                {flattenMenu(theme.siteConfig?.navigation || []).filter((x:any,i:number,a:any[])=>a.findIndex((q:any)=>q.value===x.value)===i).map((x:any)=><option key={x.value} value={x.value}>{x.label}</option>)}
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search t-shirts, pajamas, skinny tops, custom DTF..."
                className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                aria-label="Search"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center"
              >
                {isSearching ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* AJAX Live Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                <div className="p-2 border-b border-slate-100 flex justify-between items-center bg-slate-50 text-[11px] font-bold text-slate-500 uppercase px-3">
                  <span>Product Suggestions</span>
                  <span>{searchResults.length} Results</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 transition"
                    >
                      <img
                        src={prod.primaryImage}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded bg-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-slate-900">
                            {formatPrice(prod.salePrice || prod.basePrice, theme.currencySymbol)}
                          </span>
                          {prod.salePrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatPrice(prod.basePrice, theme.currencySymbol)}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setShowSearchDropdown(false)}
                  className="block p-2.5 text-center text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 hover:bg-amber-100 transition"
                >
                  View All Search Results →
                </Link>
              </div>
            )}
          </div>

          {/* Hotline Snippet (Fashion-Commerce Standard) */}
          <div className="hidden xl:flex items-center gap-2.5 border-l border-slate-200 pl-4 text-left">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                SALES HOTLINE
              </span>
              <a
                href={`tel:${theme.phone}`}
                className="text-xs font-extrabold text-slate-800 hover:text-amber-600 transition"
              >
                {theme.phone}
              </a>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-slate-700 hover:text-slate-900 transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
              aria-label="Shopping bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-bold">
                {formatPrice(subtotal, theme.currencySymbol)}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer Bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Primary Navigation Bar (Desktop) */}
      {/* Store navigation is data-driven from the Site Builder. */}
      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-sm font-black font-heading text-slate-900">
                {theme.storeName}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {(theme.siteConfig?.navigation || []).filter((item:any)=>item.visible).map((item:any)=><MobileMenuNode key={item.id} item={item} close={()=>setMobileMenuOpen(false)}/>)}
            </div>

            {/* Mobile Footer info */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Support Hotline:</p>
              <p>{theme.phone}</p>
              <p>{theme.contactEmail}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Bar (Ultra-Premium Native App Experience) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex items-center justify-around shadow-lg">
        <Link href="/" className="flex flex-col items-center text-[10px] font-bold text-slate-700 hover:text-slate-950">
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center text-[10px] font-bold text-slate-700 hover:text-slate-950">
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Shop</span>
        </Link>
        <Link href="/dtf-printing" className="flex flex-col items-center text-[10px] font-bold text-teal-700">
          <Scissors className="w-5 h-5 mb-0.5" />
          <span>DTF Print</span>
        </Link>
        <Link href="/account/wishlist" className="relative flex flex-col items-center text-[10px] font-bold text-slate-700">
          <Heart className="w-5 h-5 mb-0.5" />
          <span>Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </Link>
        <button onClick={openCart} className="relative flex flex-col items-center text-[10px] font-bold text-slate-900">
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Bag</span>
          {totalCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
              {totalCount}
            </span>
          )}
        </button>
      </div>
      {/* Store navigation */}
      <nav className="hidden lg:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 min-h-12">
          {(theme.siteConfig?.navigation || []).filter((item:any)=>item.visible).map((item:any)=><MenuNode key={item.id} item={item}/>)}
        </div>
      </nav>
    </header>
  );
}
