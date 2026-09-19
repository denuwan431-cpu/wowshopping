"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // unique item id (e.g. prodId-variantId or timestamp)
  productId: number;
  variantId?: number | null;
  name: string;
  variantTitle?: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
  price: number;
  regularPrice?: number;
  image: string;
  quantity: number;
  isCustomDtf?: boolean;
  customDetails?: {
    garmentType?: string;
    garmentColor?: string;
    garmentSize?: string;
    printArea?: string;
    fileUrl?: string;
  };
}

export interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  description?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  freeShippingThreshold = 5000,
  defaultShippingFee = 350
}: {
  children: React.ReactNode;
  freeShippingThreshold?: number;
  defaultShippingFee?: number;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("aura_cart");
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedCoupon = localStorage.getItem("aura_coupon");
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));

      const savedWishlist = localStorage.getItem("aura_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("aura_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem("aura_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("aura_coupon");
      }
    } catch (e) {
      console.error("Failed to persist coupon", e);
    }
  }, [appliedCoupon, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to persist wishlist", e);
    }
  }, [wishlist, isLoaded]);

  const addItem = (item: Omit<CartItem, "id">) => {
    const id = `${item.productId}-${item.variantId || "base"}-${item.size || ""}-${item.colorName || ""}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
    if (discount > subtotal) discount = subtotal;
  }

  const shippingFee =
    subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : defaultShippingFee;

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const applyCoupon = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(cleanCode)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: Number(data.coupon.discountValue),
          description: data.coupon.description
        });
        return { success: true, message: `Coupon ${cleanCode} applied successfully!` };
      }
      return { success: false, message: data.message || "Invalid coupon code" };
    } catch {
      return { success: false, message: "Error validating coupon" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discount,
        shippingFee,
        grandTotal,
        freeShippingThreshold,
        freeShippingProgress,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
