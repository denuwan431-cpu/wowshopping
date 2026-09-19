import { Suspense } from "react";
import { OrderConfirmationClient } from "@/components/checkout/OrderConfirmationClient";

export const metadata = {
  title: "Order Confirmation | Aura Apparel",
  description: "View and print your official fashion order confirmation and courier tracking."
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading receipt...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}
