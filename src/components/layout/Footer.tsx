"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

// lucide-react no longer ships brand/social icons (removed for trademark
// reasons), so the common social platforms are defined here as small inline
// SVGs instead of imported from the icon package.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.3c-.28-.04-1.2-.13-2.28-.13-2.25 0-3.79 1.37-3.79 3.9V10.5H8v3h2.43V21h3.07z" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.5 8.5s-.22-1.55-.9-2.24c-.86-.9-1.82-.9-2.26-.96C16.2 5 12 5 12 5h-.01s-4.2 0-7.34.3c-.44.06-1.4.06-2.26.96-.68.69-.9 2.24-.9 2.24S1.2 10.32 1.2 12.13v1.69C1.2 15.63 1.5 17.18 1.5 17.18s.22 1.55.9 2.24c.86.9 1.98.87 2.48.97C6.6 20.7 12 20.75 12 20.75s4.2-.01 7.34-.3c.44-.07 1.4-.07 2.26-.97.68-.69.9-2.24.9-2.24s.3-1.55.3-3.36v-1.69c0-1.81-.3-3.63-.3-3.63z" />
      <path d="M9.75 15.02V9.98L14.98 12.5l-5.23 2.52z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.8v2.6c-1.3 0-2.5-.4-3.5-1.1v6.4c0 3.1-2.5 5.3-5.4 5.3S5.7 17.8 5.7 14.7c0-3 2.4-5.3 5.4-5.3.3 0 .6 0 .9.1v2.7a2.6 2.6 0 0 0-.9-.15 2.6 2.6 0 1 0 2.6 2.65V3h2.8z" />
    </svg>
  );
}

const iconMap: Record<string, any> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  YouTube: YoutubeIcon,
  WhatsApp: MessageCircle,
  TikTok: TiktokIcon,
};

export function Footer() {
  const { theme } = useTheme();
  const config = theme.siteConfig;
  const socials = (config?.socialLinks || []).filter((x) => x.visible && x.url);
  const care = (config?.customerCare || []).filter((x) => x.visible);
  const columns = (config?.footerColumns || []).filter((x) => x.visible);
  const payments = (config?.paymentMethods || []).filter((x) => x.visible);

  return (
    <footer className="bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-200">
          <div className="space-y-4">
            {theme.logoUrl ? <img src={theme.logoUrl} alt={theme.storeName} className="h-10 object-contain" /> : <div className="text-xl font-black tracking-tight">{theme.storeName}</div>}
            <p className="text-sm text-slate-500 leading-6">{theme.brandDescription}</p>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex gap-2"><MapPin className="w-4 h-4 shrink-0" />{theme.address}</div>
              <div className="flex gap-2"><Phone className="w-4 h-4 shrink-0" />{theme.phone}</div>
              <div className="flex gap-2"><Mail className="w-4 h-4 shrink-0" />{theme.contactEmail}</div>
              <div className="flex gap-2"><Clock className="w-4 h-4 shrink-0" />{theme.businessHours}</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Customer Care</h4>
            <div className="space-y-2.5">{care.map((item) => <Link key={item.id} href={item.href} className="block text-sm text-slate-500 hover:text-slate-900">{item.label}</Link>)}</div>
          </div>
          {columns.slice(0, 2).map((col) => (
            <div key={col.id}><h4 className="text-xs font-bold uppercase tracking-widest mb-4">{col.title}</h4><div className="space-y-2.5">{col.links.filter((x) => x.visible).map((link) => <Link key={link.id} href={link.href} className="block text-sm text-slate-500 hover:text-slate-900">{link.label}</Link>)}</div></div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-8 pt-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3">Follow Us</div>
            <div className="flex gap-2">{socials.map((item) => { const Icon = iconMap[item.platform] || MessageCircle; return <a key={item.id} href={item.url} target="_blank" rel="noreferrer" aria-label={item.platform} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:border-slate-400 transition"><Icon className="w-4 h-4" /></a>; })}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3">Payment Methods</div>
            <div className="flex flex-wrap gap-2">{payments.map((p) => <div key={p.id} className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold flex items-center gap-2">{p.logoUrl ? <img src={p.logoUrl} alt="" className="h-5 w-auto object-contain" /> : null}{p.name}</div>)}</div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5"><div className="max-w-7xl mx-auto px-4 text-xs text-slate-400 flex justify-between gap-4"><span>© {new Date().getFullYear()} {theme.storeName}. All rights reserved.</span><span>{theme.tagline}</span></div></div>
    </footer>
  );
}
