import { pgTable, serial, text, timestamp, integer, boolean, numeric, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("customer"), // 'super_admin' | 'store_manager' | 'product_manager' | 'order_manager' | 'content_manager' | 'support_agent' | 'customer'
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  address: jsonb("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  bannerImage: text("banner_image"),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  bannerImage: text("banner_image"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  categoryId: integer("category_id").references(() => categories.id),
  collectionId: integer("collection_id").references(() => collections.id),
  brand: text("brand").default("Aura"),
  basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
  costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  stockQuantity: integer("stock_quantity").default(50).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  ratingAverage: numeric("rating_average", { precision: 3, scale: 2 }).default("5.0"),
  reviewCount: integer("review_count").default(0).notNull(),
  primaryImage: text("primary_image").notNull(),
  secondaryImage: text("secondary_image"),
  galleryImages: jsonb("gallery_images").$type<string[]>().default([]),
  attributes: jsonb("attributes").$type<Record<string, string[]>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  sku: text("sku").notNull().unique(),
  title: text("title").notNull(),
  size: text("size").notNull(),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
  material: text("material"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
  stockQuantity: integer("stock_quantity").default(20).notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address"),
  paymentMethod: text("payment_method").notNull(), // 'card' | 'bank_transfer' | 'cod' | 'koko' | 'mintpay'
  paymentStatus: text("payment_status").default("pending").notNull(), // 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: text("order_status").default("pending").notNull(), // 'pending' | 'confirmed' | 'processing' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled'
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  shippingFee: numeric("shipping_fee", { precision: 12, scale: 2 }).default("0.00").notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0.00").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  couponCode: text("coupon_code"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id),
  variantId: integer("variant_id"),
  productName: text("product_name").notNull(),
  variantTitle: text("variant_title"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(), // 'percentage' | 'fixed'
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }).default("0.00"),
  maxDiscountAmount: numeric("max_discount_amount", { precision: 12, scale: 2 }),
  usageLimit: integer("usage_limit").default(100),
  usageCount: integer("usage_count").default(0).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  isVerified: boolean("is_verified").default(true).notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  badge: text("badge"),
  styleKey: text("style_key").notNull().default("style_01"), // style_01 through style_20
  desktopImage: text("desktop_image").notNull(),
  tabletImage: text("tablet_image"),
  mobileImage: text("mobile_image"),
  ctaText: text("cta_text").default("Shop Now"),
  ctaUrl: text("cta_url").default("/shop"),
  secondaryCtaText: text("secondary_cta_text"),
  secondaryCtaUrl: text("secondary_cta_url"),
  bgColor: text("bg_color").default("#0d1322"),
  textColor: text("text_color").default("#ffffff"),
  textAlign: text("text_align").default("left"), // 'left' | 'center' | 'right'
  textPosition: text("text_position").default("center"), // 'left' | 'center' | 'right' | 'bottom-left'
  overlayOpacity: integer("overlay_opacity").default(40),
  priority: integer("priority").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const homepageSections = pgTable("homepage_sections", {
  id: serial("id").primaryKey(),
  sectionType: text("section_type").notNull(), // 'hero' | 'service_bar' | 'category_grid' | 'collection_grid' | 'product_grid' | 'banner' | 'dtf_section' | 'testimonials' | 'newsletter' | 'faq' | 'brand_story'
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  configJson: jsonb("config_json").notNull().default({}),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const themeSettings = pgTable("theme_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").default("AURA APPAREL").notNull(),
  tagline: text("tagline").default("Premium Modern Apparel & Custom DTF Printing").notNull(),
  brandDescription: text("brand_description").default("Elevated contemporary essentials, handcrafted graphics, and bespoke custom direct-to-film garment printing for the modern wardrobe.").notNull(),
  logoUrl: text("logo_url"),
  mobileLogoUrl: text("mobile_logo_url"),
  faviconUrl: text("favicon_url"),
  browserTitle: text("browser_title").default("Aura Apparel | Premium Fashion & Custom DTF Studio").notNull(),
  contactEmail: text("contact_email").default("care@auraapparel.lk").notNull(),
  phone: text("phone").default("+94 11 289 4500").notNull(),
  whatsapp: text("whatsapp").default("+94 77 123 4567").notNull(),
  address: text("address").default("148 Galle Road, Colombo 03, Sri Lanka").notNull(),
  businessHours: text("business_hours").default("Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM").notNull(),
  socialLinksJson: jsonb("social_links_json").default({
    facebook: "https://facebook.com/auraapparel",
    instagram: "https://instagram.com/auraapparel",
    whatsapp: "https://wa.me/94771234567",
    tiktok: "https://tiktok.com/@auraapparel"
  }),
  primaryColor: text("primary_color").default("#0d1322").notNull(), // Deep Indigo / Midnight Navy
  secondaryColor: text("secondary_color").default("#f97316").notNull(), // Warm Orange / Amber
  accentColor: text("accent_color").default("#0ea5e9").notNull(), // Soft Teal / Sky
  backgroundColor: text("background_color").default("#fafaf9").notNull(),
  surfaceColor: text("surface_color").default("#ffffff").notNull(),
  foregroundColor: text("foreground_color").default("#090d16").notNull(),
  radius: text("radius").default("0.5rem").notNull(),
  fontFamily: text("font_family").default("Inter").notNull(),
  headingFont: text("heading_font").default("Manrope").notNull(),
  announcementEnabled: boolean("announcement_enabled").default(true).notNull(),
  announcementText: text("announcement_text").default("FREE ISLANDWIDE DELIVERY ON ORDERS OVER LKR 5,000 | USE CODE AURA10 FOR 10% OFF").notNull(),
  announcementLink: text("announcement_link").default("/shop"),
  announcementCta: text("announcement_cta").default("SHOP NOW"),
  currencyCode: text("currency_code").default("LKR").notNull(),
  currencySymbol: text("currency_symbol").default("Rs. ").notNull(),
  freeShippingThreshold: numeric("free_shipping_threshold", { precision: 12, scale: 2 }).default("5000.00").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const popups = pgTable("popups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  ctaText: text("cta_text").default("Claim Offer"),
  ctaUrl: text("cta_url").default("/shop"),
  delaySeconds: integer("delay_seconds").default(3).notNull(),
  triggerType: text("trigger_type").default("delay").notNull(), // 'delay' | 'scroll' | 'exit'
  isActive: boolean("is_active").default(true).notNull(),
  frequency: text("frequency").default("once_per_session").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dtfCustomOrders = pgTable("dtf_custom_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  garmentType: text("garment_type").notNull(), // 'Crewneck T-Shirt' | 'Oversized Tee' | 'Kids T-Shirt' | 'Hoodie' | 'Tank Top'
  garmentColor: text("garment_color").notNull(),
  garmentSize: text("garment_size").notNull(),
  quantity: integer("quantity").notNull().default(1),
  printArea: text("print_area").notNull(), // 'Chest Small (A6)' | 'Front Center (A4)' | 'Back Full (A3)' | 'Both Sides (Front + Back)'
  fileUrl: text("file_url").notNull(),
  designNotes: text("design_notes"),
  estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("pending_review").notNull(), // 'pending_review' | 'design_approved' | 'in_print' | 'completed' | 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  width: integer("width"),
  height: integer("height"),
  folder: text("folder").default("general").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const navigationMenus = pgTable("navigation_menus", {
  id: serial("id").primaryKey(),
  menuLocation: text("menu_location").notNull().unique(), // 'header' | 'footer_1' | 'footer_2' | 'footer_3'
  title: text("title").notNull(),
  itemsJson: jsonb("items_json").notNull().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(), // 'page_view' | 'product_view' | 'add_to_cart' | 'checkout_start' | 'order_complete'
  eventDataJson: jsonb("event_data_json").default({}),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
