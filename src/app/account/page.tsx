import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AccountClient } from "@/components/account/AccountClient";

export const revalidate = 0;

export const metadata = {
  title: "My Account | Aura Apparel",
  description: "Manage your fashion wardrobe orders, delivery addresses, and account details."
};

export default async function AccountPage() {
  const sessionUser = await getSessionUser();

  let userOrders: any[] = [];
  if (sessionUser) {
    userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, sessionUser.id))
      .orderBy(desc(orders.createdAt));
  }

  return (
    <AccountClient
      initialUser={sessionUser}
      initialOrders={userOrders}
    />
  );
}
