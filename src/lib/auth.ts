import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("aura_session");
    if (!sessionCookie?.value) return null;

    const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
    if (!parsed?.id) return null;

    // Verify user exists in database
    const [found] = await db.select().from(users).where(eq(users.id, parsed.id)).limit(1);
    if (!found) return null;

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone,
      avatarUrl: found.avatarUrl
    };
  } catch {
    return null;
  }
}

export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return [
    "super_admin",
    "store_manager",
    "product_manager",
    "order_manager",
    "content_manager"
  ].includes(role);
}
