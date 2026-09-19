"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ThemeSettingsType {
  storeName: string;
  tagline: string;
  brandDescription: string;
  logoUrl?: string | null;
  mobileLogoUrl?: string | null;
  faviconUrl?: string | null;
  browserTitle: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  businessHours: string;
  socialLinksJson: any;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  foregroundColor: string;
  radius: string;
  fontFamily: string;
  headingFont: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  announcementCta: string;
  currencyCode: string;
  currencySymbol: string;
  freeShippingThreshold: string;
  siteConfig?: SiteConfig;
}

export interface SiteMenuItem { id: string; label: string; href?: string; visible: boolean; children?: SiteMenuItem[] }

export interface SiteConfig {
  navigation: SiteMenuItem[];
  customerCare: Array<{ id: string; label: string; href: string; visible: boolean }>;
  footerColumns: Array<{ id: string; title: string; visible: boolean; links: Array<{ id: string; label: string; href: string; visible: boolean }> }>;
  socialLinks: Array<{ id: string; platform: string; url: string; visible: boolean }>;
  paymentMethods: Array<{ id: string; name: string; logoUrl?: string; visible: boolean; description?: string }>;
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoEnabled?: boolean;
  popup?: { enabled: boolean; delaySeconds: number; title: string; badge: string; description: string; imageUrl?: string; ctaText: string; ctaUrl: string; promoCode?: string; showCode?: boolean };
  bottomBanner?: { enabled: boolean; title: string; subtitle?: string; imageUrl?: string; buttonText?: string; buttonUrl?: string; showText?: boolean; showButton?: boolean; bgColor?: string; textColor?: string };
}

interface ThemeContextType {
  theme: ThemeSettingsType;
  updateThemePreview: (partial: Partial<ThemeSettingsType>) => void;
  resetThemePreview: () => void;
}

const defaultTheme: ThemeSettingsType = {
  storeName: "AURA APPAREL",
  tagline: "Premium Modern Apparel & Custom DTF Printing",
  brandDescription: "Modern ready-to-wear essentials, playful kids' loungewear, and high-definition direct-to-film garment customization.",
  logoUrl: "",
  mobileLogoUrl: "",
  faviconUrl: "",
  browserTitle: "Aura Apparel | Premium Fashion & Custom DTF Studio",
  contactEmail: "care@auraapparel.lk",
  phone: "+94 11 289 4500",
  whatsapp: "+94 77 123 4567",
  address: "148 Galle Road, Colombo 03, Sri Lanka",
  businessHours: "Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM",
  socialLinksJson: {
    facebook: "https://facebook.com/auraapparel",
    instagram: "https://instagram.com/auraapparel",
    whatsapp: "https://wa.me/94771234567",
    tiktok: "https://tiktok.com/@auraapparel"
  },
  primaryColor: "#0f172a",
  secondaryColor: "#ea580c",
  accentColor: "#0284c7",
  backgroundColor: "#f8fafc",
  surfaceColor: "#ffffff",
  foregroundColor: "#090d16",
  radius: "0.5rem",
  fontFamily: "Inter",
  headingFont: "Manrope",
  announcementEnabled: true,
  announcementText: "FREE ISLANDWIDE DELIVERY ON ORDERS OVER RS. 5,000 | USE CODE AURA10 FOR 10% OFF",
  announcementLink: "/shop",
  announcementCta: "SHOP NOW",
  currencyCode: "LKR",
  currencySymbol: "Rs. ",
  freeShippingThreshold: "5000.00",
  siteConfig: {
    navigation: [
      { id: "home", label: "Home", href: "/", visible: true },
      { id: "shop", label: "Shop", href: "/shop", visible: true },
      { id: "kids", label: "Kids", href: "/shop?category=kids", visible: true, children: [
        { id: "kids-boys", label: "Boys", href: "/shop?category=kids-boys", visible: true, },
        { id: "kids-girls", label: "Girls", href: "/shop?category=kids-girls", visible: true, },
        { id: "kids-tshirt", label: "T-Shirt", href: "/shop?category=kids-tshirt", visible: true, },
        { id: "kids-full-kit", label: "Full Kit", href: "/shop?category=kids-full-kit", visible: true, },
        { id: "kids-polo", label: "Polo", href: "/shop?category=kids-polo", visible: true, },
        { id: "kids-pants", label: "Pants", href: "/shop?category=kids-pants", visible: true, },
        { id: "kids-hat", label: "Hat", href: "/shop?category=kids-hat", visible: true, },
        { id: "kids-cap", label: "Cap", href: "/shop?category=kids-cap", visible: true, },
        { id: "kids-hair-band", label: "Hair Band", href: "/shop?category=kids-hair-band", visible: true, },
        { id: "kids-shoes", label: "Shoes", href: "/shop?category=kids-shoes", visible: true, },
        { id: "kids-socks", label: "Socks", href: "/shop?category=kids-socks", visible: true, },
      ]},
      { id: "adults", label: "Adults", href: "/shop?category=adults", visible: true, children: [
        { id: "adults-crop-top", label: "Crop Top", href: "/shop?category=crop-top", visible: true },
        { id: "adults-frock", label: "Frock", href: "/shop?category=frock", visible: true },
        { id: "adults-gents-tshirt", label: "Gents T-Shirt", href: "/shop?category=gents-tshirt", visible: true },
        { id: "adults-womens-tshirt", label: "Women's T-Shirt", href: "/shop?category=womens-tshirt", visible: true },
        { id: "adults-jewellery", label: "Jewellery", href: "/shop?category=jewellery", visible: true },
        { id: "adults-cap", label: "Cap", href: "/shop?category=adult-cap", visible: true },
        { id: "adults-socks", label: "Socks", href: "/shop?category=adult-socks", visible: true },
      ]},
      { id: "offers", label: "Special Offers", href: "/shop?sale=true", visible: true },
      { id: "contact", label: "Contact Us", href: "/contact", visible: true }
    ],
    customerCare: [
      { id: "track", label: "Track Your Order", href: "/account/orders", visible: true },
      { id: "returns", label: "Return & Exchange Policy", href: "/returns", visible: true },
      { id: "size", label: "Garment Size Chart", href: "/size-guide", visible: true },
      { id: "faq", label: "Frequently Asked Questions", href: "/faq", visible: true },
      { id: "shipping", label: "Islandwide Delivery Terms", href: "/shipping", visible: true },
      { id: "support", label: "Contact Customer Support", href: "/contact", visible: true }
    ],
    footerColumns: [],
    socialLinks: [
      { id: "facebook", platform: "Facebook", url: "https://facebook.com/auraapparel", visible: true },
      { id: "instagram", platform: "Instagram", url: "https://instagram.com/auraapparel", visible: true },
      { id: "youtube", platform: "YouTube", url: "", visible: false },
      { id: "whatsapp", platform: "WhatsApp", url: "https://wa.me/94771234567", visible: true },
      { id: "tiktok", platform: "TikTok", url: "https://tiktok.com/@auraapparel", visible: true }
    ],
    paymentMethods: [
      { id: "koko", name: "Koko", visible: true },
      { id: "bank", name: "Bank Transfer", visible: true },
      { id: "cod", name: "Cash on Delivery", visible: true }
    ],
    heroVideoEnabled: false,
    heroVideoUrl: "",
    heroVideoPoster: "",
    popup: { enabled: true, delaySeconds: 3, title: "10% OFF YOUR FIRST ORDER", badge: "WELCOME OFFER", description: "Use our welcome offer on your first order.", imageUrl: "", ctaText: "SHOP NOW", ctaUrl: "/shop", promoCode: "", showCode: true },
    bottomBanner: { enabled: true, title: "New arrivals are here", subtitle: "Discover the latest styles.", imageUrl: "", buttonText: "Shop Now", buttonUrl: "/shop", showText: true, showButton: true, bgColor: "#0f172a", textColor: "#ffffff" }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  initialTheme,
  children
}: {
  initialTheme?: Partial<ThemeSettingsType>;
  children: React.ReactNode;
}) {
  const mergedSiteConfig = { ...defaultTheme.siteConfig, ...(initialTheme?.siteConfig || {}) } as SiteConfig;
  const [baseTheme] = useState<ThemeSettingsType>({ ...defaultTheme, ...initialTheme, siteConfig: mergedSiteConfig });
  const [theme, setTheme] = useState<ThemeSettingsType>({ ...defaultTheme, ...initialTheme, siteConfig: mergedSiteConfig });

  // Apply CSS custom properties whenever theme values change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--secondary", theme.secondaryColor);
    root.style.setProperty("--accent", theme.accentColor);
    root.style.setProperty("--background", theme.backgroundColor);
    root.style.setProperty("--surface", theme.surfaceColor);
    root.style.setProperty("--foreground", theme.foregroundColor);
    root.style.setProperty("--radius", theme.radius);
    if (theme.fontFamily) {
      root.style.setProperty("--font-sans", `'${theme.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
    if (theme.headingFont) {
      root.style.setProperty("--font-heading", `'${theme.headingFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
  }, [theme]);

  const updateThemePreview = (partial: Partial<ThemeSettingsType>) => {
    setTheme((prev) => ({ ...prev, ...partial }));
  };

  const resetThemePreview = () => {
    setTheme(baseTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateThemePreview, resetThemePreview }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
