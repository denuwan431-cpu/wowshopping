import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = {
  title: "Checkout | Aura Apparel",
  description: "Secure payment and islandwide delivery for your fashion order."
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
