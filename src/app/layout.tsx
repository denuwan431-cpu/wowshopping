import type { Metadata } from "next";
import { db } from "@/db";
import { themeSettings } from "@/db/schema";
import { ThemeProvider } from "@/lib/theme-context";
import { CartProvider } from "@/lib/cart-context";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [theme] = await db.select().from(themeSettings).limit(1);
    return {
      title: theme?.browserTitle || "Aura Apparel | Premium Fashion & Custom DTF Studio",
      description: theme?.brandDescription || "Modern ready-to-wear essentials and bespoke direct-to-film printing.",
      icons: {
        icon: theme?.faviconUrl || "/favicon.ico"
      }
    };
  } catch {
    return {
      title: "Aura Apparel | Premium Fashion & Custom DTF Studio",
      description: "Modern ready-to-wear essentials and bespoke direct-to-film printing."
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let themeData: any = {};
  try {
    const [theme] = await db.select().from(themeSettings).limit(1);
    if (theme) {
      const raw = (theme.socialLinksJson || {}) as any;
      themeData = { ...theme, siteConfig: raw._siteConfig || undefined, socialLinksJson: raw };
    }
  } catch (e) {
    console.error("Layout theme load error:", e);
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-amber-500 selection:text-slate-950">
        <ThemeProvider initialTheme={themeData}>
          <CartProvider
            freeShippingThreshold={parseFloat(themeData.freeShippingThreshold || "5000")}
          >
            <AppShell>{children}</AppShell>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
