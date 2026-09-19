"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Settings, ExternalLink, Menu, X, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const { theme } = useTheme();
  const [checking, setChecking] = useState(true); const [open, setOpen] = useState(false);
  useEffect(() => { fetch("/api/auth/me").then(r=>r.json()).then(d=>{ if(!d.user || !["super_admin","store_manager","product_manager","content_manager","order_manager","support_agent"].includes(d.user.role)) router.replace("/admin/login"); else setChecking(false); }).catch(()=>router.replace("/admin/login")); },[router]);
  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading admin workspace…</div>;
  const items=[{label:"Dashboard",href:"/admin",icon:LayoutDashboard},{label:"Product Catalog",href:"/admin/products",icon:Package},{label:"Site Builder",href:"/admin/settings",icon:Sparkles}];
  return <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3"><button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={()=>setOpen(true)}><Menu className="w-5 h-5"/></button><div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-black">A</div><div><div className="font-black text-sm leading-tight">{theme.storeName}</div><div className="text-[10px] text-slate-500 uppercase tracking-widest">Commerce Admin</div></div></div>
      <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50"><span>View Store</span><ExternalLink className="w-3.5 h-3.5"/></Link>
    </header>
    <div className="flex flex-1 min-h-0">
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 p-4 flex-col gap-1"><div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">Management</div>{items.map(({label,href,icon:Icon})=><Link key={href} href={href} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold ${pathname===href?"bg-slate-950 text-white shadow":"text-slate-600 hover:bg-slate-100"}`}><Icon className="w-4 h-4"/>{label}</Link>)}<div className="mt-auto border-t pt-3"><Link href="/admin/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"><Settings className="w-4 h-4"/>Store Settings</Link></div></aside>
      {open&&<div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-slate-950/40" onClick={()=>setOpen(false)}/><aside className="relative w-72 h-full bg-white p-5 shadow-2xl"><div className="flex items-center justify-between mb-5"><b>Admin Navigation</b><button onClick={()=>setOpen(false)}><X/></button></div>{items.map(({label,href,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold hover:bg-slate-100"><Icon className="w-4 h-4"/>{label}</Link>)}</aside></div>}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  </div>;
}
