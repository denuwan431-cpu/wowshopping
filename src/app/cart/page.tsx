import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata = {
  title: "Shopping Cart | Aura Apparel",
  description: "Review your selected apparel items, apply promo coupons, and proceed to checkout."
};

export default function CartPage() {
  return <CartPageClient />;
}
