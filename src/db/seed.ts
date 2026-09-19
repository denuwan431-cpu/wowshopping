import { db } from "./index";
import {
  users,
  categories,
  collections,
  products,
  productVariants,
  orders,
  orderItems,
  coupons,
  reviews,
  banners,
  homepageSections,
  themeSettings,
  popups,
  navigationMenus,
  media
} from "./schema";

export async function seedDatabase() {
  console.log("Starting database seed...");

  // Check if already seeded
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    console.log("Database already has records, checking theme and core items...");
  }

  // 1. Theme Settings
  const existingTheme = await db.select().from(themeSettings).limit(1);
  if (existingTheme.length === 0) {
    await db.insert(themeSettings).values({
      storeName: "AURA APPAREL",
      tagline: "Premium Modern Apparel & Custom DTF Printing",
      brandDescription: "Modern ready-to-wear essentials, playful kids' loungewear, and high-definition direct-to-film garment customization engineered for enduring softness and timeless streetwear aesthetics.",
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
        tiktok: "https://tiktok.com/@auraapparel",
        _siteConfig: {
          navigation: [
            { id: "home", label: "Home", href: "/", visible: true },
            { id: "shop", label: "Shop", href: "/shop", visible: true },
            { id: "kids", label: "Kids", href: "/shop?category=kids", visible: true },
            { id: "adults", label: "Adults", href: "/shop?category=adults", visible: true },
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
            { id: "koko", name: "Koko", logoUrl: "", visible: true },
            { id: "bank", name: "Bank Transfer", logoUrl: "", visible: true },
            { id: "cod", name: "Cash on Delivery", logoUrl: "", visible: true }
          ],
          heroVideoEnabled: false, heroVideoUrl: "", heroVideoPoster: ""
        }
      },
      primaryColor: "#0f172a", // Deep Indigo / Midnight Navy
      secondaryColor: "#ea580c", // Warm Orange / Amber
      accentColor: "#0284c7", // Soft Teal / Sky
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
      freeShippingThreshold: "5000.00"
    });
  }

  // 2. Users
  let adminUser = existingUsers.find(u => u.email === "admin@auraapparel.lk");
  if (!adminUser) {
    const insertedUsers = await db.insert(users).values([
      {
        name: "Aura Admin",
        email: "admin@auraapparel.lk",
        phone: "+94 77 000 1111",
        role: "super_admin",
        passwordHash: "admin123#Secure", // In a real system, hashed with bcrypt. For demo, plain check or simple salt
        avatarUrl: "https://images.pexels.com/photos/12922554/pexels-photo-12922554.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
        address: {
          addressLine: "Aura HQ, Level 4, Orion City",
          city: "Colombo",
          postalCode: "00900",
          country: "Sri Lanka"
        }
      },
      {
        name: "Store Manager",
        email: "manager@auraapparel.lk",
        phone: "+94 77 000 2222",
        role: "store_manager",
        passwordHash: "manager123#",
        avatarUrl: "https://images.pexels.com/photos/9558588/pexels-photo-9558588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300"
      },
      {
        name: "Dulani Perera",
        email: "dulani@example.com",
        phone: "+94 71 301 6688",
        role: "customer",
        passwordHash: "customer123#",
        avatarUrl: "https://images.pexels.com/photos/13840200/pexels-photo-13840200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
        address: {
          addressLine: "406/B2/1 Thalagala Junction",
          city: "Homagama",
          postalCode: "10200",
          country: "Sri Lanka"
        }
      }
    ]).returning();
    adminUser = insertedUsers[0];
  }

  // 3. Categories
  const existingCats = await db.select().from(categories).limit(1);
  let catMap: Record<string, number> = {};
  if (existingCats.length === 0) {
    const insertedCats = await db.insert(categories).values([
      {
        name: "Kids",
        slug: "kids",
        description: "Soft combed cotton t-shirts, cozy pajamas, and playful printed daily wear for infants to toddlers.",
        image: "https://images.pexels.com/photos/4006948/pexels-photo-4006948.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
        bannerImage: "https://images.pexels.com/photos/8501417/pexels-photo-8501417.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        sortOrder: 1,
        isActive: true
      },
      {
        name: "Teens",
        slug: "teens",
        description: "Relaxed streetwear silhouettes, expressive typography, and oversized graphic apparel.",
        image: "https://images.pexels.com/photos/31716926/pexels-photo-31716926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
        bannerImage: "https://images.pexels.com/photos/8217299/pexels-photo-8217299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        sortOrder: 2,
        isActive: true
      },
      {
        name: "Adults",
        slug: "adults",
        description: "Premium unisex heavy cotton basics, fitted tops, and contemporary everyday staples.",
        image: "https://images.pexels.com/photos/8217299/pexels-photo-8217299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
        bannerImage: "https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        sortOrder: 3,
        isActive: true
      },
      {
        name: "Custom DTF Printing",
        slug: "dtf-printing",
        description: "High-definition Direct-to-Film transfer technology for custom apparel, band merch, and brand lines.",
        image: "https://images.pexels.com/photos/27893026/pexels-photo-27893026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
        bannerImage: "https://images.pexels.com/photos/27893067/pexels-photo-27893067.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        sortOrder: 4,
        isActive: true
      },
      {
        name: "Kids Pajamas",
        slug: "kids-pajamas",
        description: "Ultra-soft two-piece pajama sets designed for maximum overnight breathing and playful comfort.",
        image: "https://images.pexels.com/photos/8501663/pexels-photo-8501663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
        sortOrder: 5,
        isActive: true
      },
      {
        name: "Tank & Skinny Tops",
        slug: "tank-skinny-tops",
        description: "Form-flattering sleeveless essentials, ribbed skinny tops, and summer layering garments.",
        image: "https://images.pexels.com/photos/26800161/pexels-photo-26800161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
        sortOrder: 6,
        isActive: true
      }
    ]).returning();

    insertedCats.forEach(c => {
      catMap[c.slug] = c.id;
    });
  } else {
    const all = await db.select().from(categories);
    all.forEach(c => {
      catMap[c.slug] = c.id;
    });
  }

  // 4. Collections
  const existingColls = await db.select().from(collections).limit(1);
  let collMap: Record<string, number> = {};
  if (existingColls.length === 0) {
    const insertedColls = await db.insert(collections).values([
      {
        name: "New Arrivals 2026",
        slug: "new-arrivals",
        description: "Our freshest drops featuring breathable fabrics and contemporary silhouettes.",
        bannerImage: "https://images.pexels.com/photos/35045844/pexels-photo-35045844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        isActive: true
      },
      {
        name: "DTF Artist Spotlight",
        slug: "dtf-spotlight",
        description: "Vibrant high-pigment DTF garments created in collaboration with indie illustrators.",
        bannerImage: "https://images.pexels.com/photos/27893029/pexels-photo-27893029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        isActive: true
      },
      {
        name: "Cozy Sleep & Lounge",
        slug: "cozy-lounge",
        description: "Plush, non-restrictive organic cotton loungewear for kids and families.",
        bannerImage: "https://images.pexels.com/photos/8501427/pexels-photo-8501427.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        isActive: true
      }
    ]).returning();

    insertedColls.forEach(c => {
      collMap[c.slug] = c.id;
    });
  } else {
    const all = await db.select().from(collections);
    all.forEach(c => {
      collMap[c.slug] = c.id;
    });
  }

  // 5. Products & Variants
  const existingProds = await db.select().from(products).limit(1);
  if (existingProds.length === 0) {
    console.log("Seeding realistic apparel products and variants...");

    const productCatalog = [
      {
        name: "Cosmic Dino Two-Piece Kids Pajama Set",
        slug: "cosmic-dino-two-piece-kids-pajama-set",
        sku: "PJ-000214",
        categorySlug: "kids-pajamas",
        collectionSlug: "cozy-lounge",
        basePrice: "1600.00",
        salePrice: "1200.00",
        costPrice: "650.00",
        isFeatured: true,
        stockQuantity: 45,
        ratingAverage: "4.90",
        reviewCount: 38,
        shortDescription: "Ultra-gentle 100% natural combed cotton pajama set designed with fun dinosaur graphics and anti-irritation flatlock seams.",
        description: "Engineered specifically for sensitive skin, our Cosmic Dino pajama set combines ultra-soft breathable combed cotton jersey with durable stretch ribbed cuffs. Includes matching long-sleeve top and elasticated lounge trousers. Colorfast non-toxic eco dye ensures colors stay vibrant wash after wash.",
        primaryImage: "https://images.pexels.com/photos/8501417/pexels-photo-8501417.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/8501663/pexels-photo-8501663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/8501417/pexels-photo-8501417.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/8501663/pexels-photo-8501663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/20026092/pexels-photo-20026092.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["Kids", "Pajama", "Loungewear", "Cotton", "Sale"],
        attributes: {
          Size: ["Month 6-18", "Year 2-3", "Year 4-5", "Year 6-7", "Year 8-9"],
          Color: ["Forest Green", "Dusty Pink", "Navy Blue"]
        },
        variants: [
          { size: "Month 6-18", colorName: "Forest Green", colorHex: "#15803d", price: "1200.00", stockQuantity: 10 },
          { size: "Year 2-3", colorName: "Forest Green", colorHex: "#15803d", price: "1200.00", stockQuantity: 15 },
          { size: "Year 4-5", colorName: "Forest Green", colorHex: "#15803d", price: "1250.00", stockQuantity: 12 },
          { size: "Year 2-3", colorName: "Dusty Pink", colorHex: "#f472b6", price: "1200.00", stockQuantity: 8 },
          { size: "Year 4-5", colorName: "Navy Blue", colorHex: "#1e293b", price: "1250.00", stockQuantity: 14 }
        ]
      },
      {
        name: "Playful Shark Graphic Kids T-Shirt",
        slug: "playful-shark-graphic-kids-t-shirt",
        sku: "KD-SHK-001",
        categorySlug: "kids",
        collectionSlug: "new-arrivals",
        basePrice: "1250.00",
        salePrice: "950.00",
        costPrice: "420.00",
        isFeatured: true,
        stockQuantity: 60,
        ratingAverage: "4.85",
        reviewCount: 22,
        shortDescription: "Signature kids graphic tee made with 180 GSM single jersey ring-spun cotton and water-based soft touch print.",
        description: "Built for everyday energy! Crafted with premium ring-spun single jersey cotton that offers superior softness, shape retention, and breathability in tropical weather. Features pre-shrunk construction and reinforced neck taping.",
        primaryImage: "https://images.pexels.com/photos/4006948/pexels-photo-4006948.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/15179152/pexels-photo-15179152.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/4006948/pexels-photo-4006948.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/15179152/pexels-photo-15179152.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["Kids", "T-Shirt", "Graphic", "Boys", "Casual"],
        attributes: {
          Size: ["Year 2-3", "Year 4-5", "Year 6-7", "Year 8-9"],
          Color: ["Charcoal Grey", "Lemon Yellow", "Apple Green"]
        },
        variants: [
          { size: "Year 2-3", colorName: "Charcoal Grey", colorHex: "#334155", price: "950.00", stockQuantity: 20 },
          { size: "Year 4-5", colorName: "Lemon Yellow", colorHex: "#facc15", price: "950.00", stockQuantity: 20 },
          { size: "Year 6-7", colorName: "Apple Green", colorHex: "#4ade80", price: "950.00", stockQuantity: 20 }
        ]
      },
      {
        name: "Sweet Whimsical Kitty DTF Unisex Kids T-Shirt",
        slug: "sweet-kitty-dtf-printed-unisex-kids-t-shirt",
        sku: "DTF-KT-1005",
        categorySlug: "dtf-printing",
        collectionSlug: "dtf-spotlight",
        basePrice: "1150.00",
        salePrice: "650.00",
        costPrice: "310.00",
        isFeatured: true,
        stockQuantity: 34,
        ratingAverage: "5.00",
        reviewCount: 47,
        shortDescription: "Ultra-vibrant direct-to-film printed graphic tee on premium aqua single jersey cotton.",
        description: "Brighten your child's day with our adorable Sweet Kitty DTF graphic t-shirt. Printed using industry-leading 8-color DTF pigment ink that resists cracking and peeling over 50+ washes. Made of 65% combed cotton and 35% polyester blend for quick-dry lightweight wear.",
        primaryImage: "https://images.pexels.com/photos/30683099/pexels-photo-30683099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/32071161/pexels-photo-32071161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/30683099/pexels-photo-30683099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/32071161/pexels-photo-32071161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["Kids", "DTF", "T-Shirt", "Aqua", "Cartoon", "Best Seller"],
        attributes: {
          Size: ["Month 6-18", "Year 2-3", "Year 4-5", "Year 6-7", "Year 8-9"],
          Color: ["Aqua Blue", "Light Pink", "Optic White"]
        },
        variants: [
          { size: "Month 6-18", colorName: "Aqua Blue", colorHex: "#06b6d4", price: "650.00", stockQuantity: 12 },
          { size: "Year 2-3", colorName: "Aqua Blue", colorHex: "#06b6d4", price: "650.00", stockQuantity: 12 },
          { size: "Year 4-5", colorName: "Light Pink", colorHex: "#fbcfe8", price: "650.00", stockQuantity: 10 },
          { size: "Year 6-7", colorName: "Optic White", colorHex: "#ffffff", price: "750.00", stockQuantity: 10 }
        ]
      },
      {
        name: "Kids Unisex Skinner Sleeveless Tank - Summer Vibe",
        slug: "kids-unisex-skinner-sleeveless-tank-summer-vibe",
        sku: "KD-SKN-27",
        categorySlug: "tank-skinny-tops",
        collectionSlug: "new-arrivals",
        basePrice: "700.00",
        salePrice: "500.00",
        costPrice: "240.00",
        isFeatured: true,
        stockQuantity: 55,
        ratingAverage: "4.75",
        reviewCount: 16,
        shortDescription: "Breathable ribbed cotton unisex sleeveless skinner outfit for warm weather and beach holidays.",
        description: "Keep your little ones cool and comfortable under the sun! Made of 100% fine ribbed cotton with athletic armhole binding and smooth tagless interior.",
        primaryImage: "https://images.pexels.com/photos/5560013/pexels-photo-5560013.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/5560007/pexels-photo-5560007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/5560013/pexels-photo-5560013.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/5560007/pexels-photo-5560007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["Kids", "Tank", "Sleeveless", "Summer", "Skinny"],
        attributes: {
          Size: ["Year 2-3", "Year 4-5", "Year 6-7"],
          Color: ["Mango Yellow", "Peacock Blue", "Crimson Red"]
        },
        variants: [
          { size: "Year 2-3", colorName: "Mango Yellow", colorHex: "#f59e0b", price: "500.00", stockQuantity: 18 },
          { size: "Year 4-5", colorName: "Peacock Blue", colorHex: "#0284c7", price: "500.00", stockQuantity: 18 },
          { size: "Year 6-7", colorName: "Crimson Red", colorHex: "#dc2626", price: "600.00", stockQuantity: 19 }
        ]
      },
      {
        name: "Atelier Heavyweight Unisex Boxy Tee",
        slug: "atelier-heavyweight-unisex-boxy-tee",
        sku: "AD-UNX-001",
        categorySlug: "adults",
        collectionSlug: "new-arrivals",
        basePrice: "1850.00",
        salePrice: "1450.00",
        costPrice: "680.00",
        isFeatured: true,
        stockQuantity: 75,
        ratingAverage: "4.95",
        reviewCount: 64,
        shortDescription: "240 GSM ultra-heavy combed cotton streetwear boxy tee with tailored drop-shoulder cut.",
        description: "The ultimate modern everyday t-shirt. Cut in an oversized boxy silhouette with heavy 240 GSM organic ring-spun cotton. High-density 1x1 ribbed collar that will never bacon or sag. Finished with double needle hem stitching and garment enzyme wash for velvety hand feel.",
        primaryImage: "https://images.pexels.com/photos/8217299/pexels-photo-8217299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/15553971/pexels-photo-15553971.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/8217299/pexels-photo-8217299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/15553971/pexels-photo-15553971.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/9558588/pexels-photo-9558588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["Adults", "Unisex", "Heavyweight", "Oversized", "Streetwear"],
        attributes: {
          Size: ["S", "M", "L", "XL", "XXL"],
          Color: ["Off White", "Vintage Black", "Sage Green"]
        },
        variants: [
          { size: "S", colorName: "Off White", colorHex: "#f8fafc", price: "1450.00", stockQuantity: 15 },
          { size: "M", colorName: "Off White", colorHex: "#f8fafc", price: "1450.00", stockQuantity: 20 },
          { size: "L", colorName: "Vintage Black", colorHex: "#1e293b", price: "1450.00", stockQuantity: 20 },
          { size: "XL", colorName: "Sage Green", colorHex: "#64748b", price: "1450.00", stockQuantity: 10 }
        ]
      },
      {
        name: "Cyber Tiger DTF Graphic Streetwear Tee",
        slug: "cyber-tiger-dtf-graphic-streetwear-tee",
        sku: "DTF-TIG-2026",
        categorySlug: "dtf-printing",
        collectionSlug: "dtf-spotlight",
        basePrice: "1950.00",
        salePrice: "1350.00",
        costPrice: "620.00",
        isFeatured: true,
        stockQuantity: 42,
        ratingAverage: "4.92",
        reviewCount: 39,
        shortDescription: "High-density holographic-effect DTF print on obsidian black combed cotton jersey.",
        description: "Engineered with our premium commercial DTF printing process. High saturation neon colors that hold extreme detail, from subtle gradients to crisp brushstrokes. 100% breathable with zero rubbery sticky feel on the chest.",
        primaryImage: "https://images.pexels.com/photos/9558766/pexels-photo-9558766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/9985771/pexels-photo-9985771.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/9558766/pexels-photo-9558766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/9985771/pexels-photo-9985771.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["DTF", "Streetwear", "Graphic", "Adults", "Best Seller"],
        attributes: {
          Size: ["S", "M", "L", "XL"],
          Color: ["Obsidian Black", "Pure White"]
        },
        variants: [
          { size: "S", colorName: "Obsidian Black", colorHex: "#0f172a", price: "1350.00", stockQuantity: 12 },
          { size: "M", colorName: "Obsidian Black", colorHex: "#0f172a", price: "1350.00", stockQuantity: 15 },
          { size: "L", colorName: "Obsidian Black", colorHex: "#0f172a", price: "1350.00", stockQuantity: 15 }
        ]
      },
      {
        name: "Ribbed Minimalist Form-Fitting Skinny Top",
        slug: "ribbed-minimalist-form-fitting-skinny-top",
        sku: "LD-SKN-09",
        categorySlug: "tank-skinny-tops",
        collectionSlug: "new-arrivals",
        basePrice: "1350.00",
        salePrice: "1100.00",
        costPrice: "480.00",
        isFeatured: false,
        stockQuantity: 30,
        ratingAverage: "4.80",
        reviewCount: 19,
        shortDescription: "Buttery soft modal-blend 2x2 ribbed sleeveless cropped top with scoop neckline.",
        description: "A foundational wardrobe staple. Made from an ultra-luxe modal-cotton-spandex weave that sculpts softly without restricting. Flattering scoop neckline and reinforced seams.",
        primaryImage: "https://images.pexels.com/photos/26800161/pexels-photo-26800161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/10841714/pexels-photo-10841714.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/26800161/pexels-photo-26800161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/10841714/pexels-photo-10841714.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["Women", "Skinny", "Top", "Ribbed", "Summer"],
        attributes: {
          Size: ["XS", "S", "M", "L"],
          Color: ["Onyx Black", "Clay Nude", "Coral Rose"]
        },
        variants: [
          { size: "XS", colorName: "Onyx Black", colorHex: "#111827", price: "1100.00", stockQuantity: 8 },
          { size: "S", colorName: "Onyx Black", colorHex: "#111827", price: "1100.00", stockQuantity: 12 },
          { size: "M", colorName: "Clay Nude", colorHex: "#d97706", price: "1100.00", stockQuantity: 10 }
        ]
      },
      {
        name: "Vintage Botanical Golden Rose Fitted Tee",
        slug: "vintage-botanical-golden-rose-fitted-tee",
        sku: "LD-ROSE-21",
        categorySlug: "adults",
        collectionSlug: "new-arrivals",
        basePrice: "1450.00",
        salePrice: "1150.00",
        costPrice: "520.00",
        isFeatured: true,
        stockQuantity: 28,
        ratingAverage: "4.88",
        reviewCount: 31,
        shortDescription: "Soft combed cotton tailored tee featuring metallic antique gold botanical rose DTF print.",
        description: "Elegant and casual at once. Printed with specialized high-luster gold DTF inks on premium jet black ring-spun cotton. Cut to contour comfortably with a gentle tapered waist.",
        primaryImage: "https://images.pexels.com/photos/13999462/pexels-photo-13999462.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        secondaryImage: "https://images.pexels.com/photos/10121995/pexels-photo-10121995.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        galleryImages: [
          "https://images.pexels.com/photos/13999462/pexels-photo-13999462.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
          "https://images.pexels.com/photos/10121995/pexels-photo-10121995.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
        ],
        tags: ["Women", "Rose", "Graphic", "Floral", "Fitted"],
        attributes: {
          Size: ["S", "M", "L", "XL"],
          Color: ["Jet Black", "Heather Grey"]
        },
        variants: [
          { size: "S", colorName: "Jet Black", colorHex: "#0a0a0a", price: "1150.00", stockQuantity: 10 },
          { size: "M", colorName: "Jet Black", colorHex: "#0a0a0a", price: "1150.00", stockQuantity: 12 },
          { size: "L", colorName: "Jet Black", colorHex: "#0a0a0a", price: "1150.00", stockQuantity: 6 }
        ]
      }
    ];

    for (const prod of productCatalog) {
      const catId = catMap[prod.categorySlug] || catMap["kids"] || 1;
      const collId = collMap[prod.collectionSlug] || null;

      const [newProd] = await db.insert(products).values({
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        description: prod.description,
        shortDescription: prod.shortDescription,
        categoryId: catId,
        collectionId: collId,
        brand: "Aura",
        basePrice: prod.basePrice,
        salePrice: prod.salePrice,
        costPrice: prod.costPrice,
        isFeatured: prod.isFeatured,
        isPublished: true,
        stockQuantity: prod.stockQuantity,
        lowStockThreshold: 5,
        tags: prod.tags,
        ratingAverage: prod.ratingAverage,
        reviewCount: prod.reviewCount,
        primaryImage: prod.primaryImage,
        secondaryImage: prod.secondaryImage,
        galleryImages: prod.galleryImages,
        attributes: prod.attributes
      }).returning();

      // Insert variants
      for (const v of prod.variants) {
        await db.insert(productVariants).values({
          productId: newProd.id,
          sku: `${prod.sku}-${v.size.replace(/\s+/g, "")}-${v.colorName.replace(/\s+/g, "")}`.toUpperCase(),
          title: `${prod.name} - ${v.size} / ${v.colorName}`,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          material: "100% Combed Cotton",
          price: prod.basePrice,
          salePrice: v.price,
          stockQuantity: v.stockQuantity,
          imageUrl: prod.primaryImage,
          isActive: true
        });
      }

      // Insert realistic reviews
      await db.insert(reviews).values([
        {
          productId: newProd.id,
          customerName: "Kasun Jayasundara",
          rating: 5,
          title: "Phenomenal quality and rapid delivery!",
          comment: "Fabric feels incredibly soft and high quality. The print did not fade even after 3 machine washes. Will order more next week.",
          isVerified: true,
          isApproved: true
        },
        {
          productId: newProd.id,
          customerName: "Minoli Fernando",
          rating: 5,
          title: "Perfect fit for my little one",
          comment: "The sizing is spot on according to the chart. Colors are so bright and cute! Highly recommend Aura Apparel.",
          isVerified: true,
          isApproved: true
        }
      ]);
    }
  }

  // 6. Banners (Rich styles 01-20 configured)
  const existingBanners = await db.select().from(banners).limit(1);
  if (existingBanners.length === 0) {
    console.log("Seeding promotional and campaign banners...");

    await db.insert(banners).values([
      {
        title: "ELEVATED MODERN APPAREL",
        subtitle: "Architectural cuts, breathable organic fibers, and curated wardrobe staples designed for tropical everyday life.",
        badge: "AUTUMN/WINTER 2026",
        styleKey: "style_01", // Full-width editorial hero
        desktopImage: "https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1920",
        mobileImage: "https://images.pexels.com/photos/8217299/pexels-photo-8217299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        ctaText: "EXPLORE COLLECTION",
        ctaUrl: "/shop",
        secondaryCtaText: "CUSTOM DTF STUDIO",
        secondaryCtaUrl: "/dtf-printing",
        bgColor: "#0d1322",
        textColor: "#ffffff",
        textAlign: "left",
        textPosition: "center",
        overlayOpacity: 45,
        priority: 1,
        isActive: true
      },
      {
        title: "BESPOKE DTF GARMENT PRINTING",
        subtitle: "Bring your original designs to life with museum-grade color saturation from just Rs. 650/=. No minimum order quantity.",
        badge: "DIRECT-TO-FILM TECH",
        styleKey: "style_15", // Custom DTF banner
        desktopImage: "https://images.pexels.com/photos/27893067/pexels-photo-27893067.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1920",
        mobileImage: "https://images.pexels.com/photos/27893026/pexels-photo-27893026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        ctaText: "PRINT YOUR DESIGN",
        ctaUrl: "/dtf-printing",
        secondaryCtaText: "VIEW DTF TEES",
        secondaryCtaUrl: "/shop?category=dtf-printing",
        bgColor: "#111827",
        textColor: "#ffffff",
        textAlign: "left",
        textPosition: "center",
        overlayOpacity: 50,
        priority: 2,
        isActive: true
      },
      {
        title: "COZY DREAMLAND KIDS PAJAMAS",
        subtitle: "100% natural breathable combed cotton. Soft flatlock seams that prevent itching and keep toddlers smiling all night.",
        badge: "NEW COZY DROP",
        styleKey: "style_16", // Kids collection banner
        desktopImage: "https://images.pexels.com/photos/8501417/pexels-photo-8501417.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1920",
        mobileImage: "https://images.pexels.com/photos/8501663/pexels-photo-8501663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        ctaText: "SHOP KIDS SLEEPWEAR",
        ctaUrl: "/shop?category=kids-pajamas",
        bgColor: "#0f172a",
        textColor: "#ffffff",
        textAlign: "center",
        textPosition: "center",
        overlayOpacity: 35,
        priority: 3,
        isActive: true
      },
      {
        title: "FREE ISLANDWIDE SHIPPING ON 5+ ITEMS",
        subtitle: "Stock up on everyday essentials, graphic tees, and pajama sets. Delivered directly to your doorstep anywhere in Sri Lanka.",
        badge: "LIMITED OFFER",
        styleKey: "style_13", // Discount campaign
        desktopImage: "https://images.pexels.com/photos/35045844/pexels-photo-35045844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1920",
        mobileImage: "https://images.pexels.com/photos/35045844/pexels-photo-35045844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        ctaText: "CLAIM OFFER",
        ctaUrl: "/shop",
        bgColor: "#1e1b4b",
        textColor: "#ffffff",
        textAlign: "center",
        textPosition: "center",
        overlayOpacity: 40,
        priority: 4,
        isActive: true
      }
    ]);
  }

  // 7. Coupons
  const existingCoupons = await db.select().from(coupons).limit(1);
  if (existingCoupons.length === 0) {
    await db.insert(coupons).values([
      {
        code: "AURA10",
        description: "10% off your entire fashion order",
        discountType: "percentage",
        discountValue: "10.00",
        minOrderAmount: "2000.00",
        maxDiscountAmount: "2500.00",
        usageLimit: 500,
        usageCount: 34,
        isActive: true
      },
      {
        code: "SUMMER500",
        description: "Rs. 500 off on orders above Rs. 4,000",
        discountType: "fixed",
        discountValue: "500.00",
        minOrderAmount: "4000.00",
        usageLimit: 200,
        usageCount: 18,
        isActive: true
      },
      {
        code: "FREESHIP",
        description: "Free islandwide courier delivery",
        discountType: "percentage",
        discountValue: "100.00", // applied to shipping
        minOrderAmount: "3000.00",
        usageLimit: 1000,
        usageCount: 92,
        isActive: true
      }
    ]);
  }

  // 8. Popups
  const existingPopups = await db.select().from(popups).limit(1);
  if (existingPopups.length === 0) {
    await db.insert(popups).values({
      title: "UNLOCK 10% OFF YOUR FIRST ORDER",
      description: "Join the Aura Apparel community today. Get exclusive access to limited edition drops, DTF printing promotions, and VIP seasonal previews.",
      imageUrl: "https://images.pexels.com/photos/8217299/pexels-photo-8217299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
      ctaText: "APPLY CODE AURA10",
      ctaUrl: "/shop",
      delaySeconds: 4,
      triggerType: "delay",
      isActive: true,
      frequency: "once_per_session"
    });
  }

  // 9. Navigation Menus
  const existingMenus = await db.select().from(navigationMenus).limit(1);
  if (existingMenus.length === 0) {
    await db.insert(navigationMenus).values([
      {
        menuLocation: "header",
        title: "Main Navigation",
        itemsJson: [
          { label: "Home", url: "/" },
          {
            label: "Shop",
            url: "/shop",
            children: [
              { label: "All Apparel", url: "/shop" },
              { label: "New Arrivals", url: "/shop?collection=new-arrivals" },
              { label: "Best Sellers", url: "/shop?sort=best_selling" },
              { label: "Special Offers", url: "/shop?sale=true" }
            ]
          },
          {
            label: "Kids",
            url: "/shop?category=kids",
            children: [
              { label: "Kids T-Shirts", url: "/shop?category=kids" },
              { label: "Kids Pajamas", url: "/shop?category=kids-pajamas" },
              { label: "Kids Skinny & Tanks", url: "/shop?category=tank-skinny-tops" }
            ]
          },
          { label: "Teens", url: "/shop?category=teens" },
          { label: "Adults", url: "/shop?category=adults" },
          { label: "Custom DTF Printing", url: "/dtf-printing", badge: "HOT" },
          { label: "Contact Us", url: "/contact" }
        ]
      },
      {
        menuLocation: "footer_1",
        title: "Customer Care",
        itemsJson: [
          { label: "Track Your Order", url: "/account/orders" },
          { label: "Return & Exchange Policy", url: "/returns" },
          { label: "Garment Size Guide", url: "/size-guide" },
          { label: "DTF File Guidelines", url: "/dtf-printing" },
          { label: "Frequently Asked Questions", url: "/faq" }
        ]
      },
      {
        menuLocation: "footer_2",
        title: "Collections",
        itemsJson: [
          { label: "Kids Pajama Sets", url: "/shop?category=kids-pajamas" },
          { label: "Adults Boxy T-Shirts", url: "/shop?category=adults" },
          { label: "Custom DTF Merch", url: "/dtf-printing" },
          { label: "Sleeveless Skinny Tanks", url: "/shop?category=tank-skinny-tops" },
          { label: "New Drops 2026", url: "/shop?collection=new-arrivals" }
        ]
      }
    ]);
  }

  // 10. Sample Orders
  const existingOrders = await db.select().from(orders).limit(1);
  if (existingOrders.length === 0 && adminUser) {
    const allProds = await db.select().from(products).limit(2);
    if (allProds.length > 0) {
      const [order1] = await db.insert(orders).values({
        orderNumber: "AUR-892401",
        userId: adminUser.id,
        customerName: "Dulani Perera",
        customerEmail: "dulani@example.com",
        customerPhone: "+94 71 301 6688",
        shippingAddress: {
          fullName: "Dulani Perera",
          addressLine: "406/B2/1 Thalagala Junction",
          city: "Homagama",
          postalCode: "10200",
          country: "Sri Lanka"
        },
        paymentMethod: "cod",
        paymentStatus: "paid",
        orderStatus: "delivered",
        subtotal: "2850.00",
        discount: "285.00",
        shippingFee: "350.00",
        tax: "0.00",
        total: "2915.00",
        couponCode: "AURA10",
        trackingNumber: "PRN-LK-902384",
        notes: "Please call before arriving."
      }).returning();

      await db.insert(orderItems).values([
        {
          orderId: order1.id,
          productId: allProds[0].id,
          productName: allProds[0].name,
          variantTitle: "Year 4-5 / Forest Green",
          price: "1200.00",
          quantity: 2,
          total: "2400.00",
          imageUrl: allProds[0].primaryImage
        }
      ]);
    }
  }

  console.log("Database seed completed successfully!");
}
