"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
// import { getSession } from "@/lib/auth/client";
import { auth } from "@/lib/auth/server";
// import {  useSession } from "@/lib/auth/client";

// ── helper: get authed user or throw ──────────────────────────────────────────
async function requireUser() {
  // const session = await useSession({ headers: await headers() });
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

// ── GET all products for current user ─────────────────────────────────────────
export async function getProducts() {
  const user = await requireUser();
  return db
    .select()
    .from(products)
    .where(eq(products.userId, user.id))
    .orderBy(products.createdAt);
}

// ── CREATE a new tracked product ──────────────────────────────────────────────
export async function createProduct(data: {
  name: string;
  category: string;
  image: string;
  msrp: number;
  period: number;
}) {
  const user = await requireUser();

  const [product] = await db
    .insert(products)
    .values({
      userId:       user.id,
      name:         data.name,
      category:     data.category,
      image:        data.image,
      msrp:         data.msrp,
      currentPrice: data.msrp,   // starts at MSRP
      lowestFound:  data.msrp,   // starts at MSRP
      period:       data.period,
      daysElapsed:  0,
      status:       "tracking",
      fraudRisk:    "low",
    })
    .returning();

  revalidatePath("/");
  return product;
}

// ── UPDATE a product (price update, status change, etc.) ──────────────────────
export async function updateProduct(
  id: string,
  data: Partial<{
    currentPrice: number;
    lowestFound:  number;
    daysElapsed:  number;
    status:       string;
    fraudRisk:    string;
  }>
) {
  const user = await requireUser();

  const [updated] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.userId, user.id)))
    .returning();

  revalidatePath("/");
  return updated;
}

// ── DELETE a product ───────────────────────────────────────────────────────────
export async function deleteProduct(id: string) {
  const user = await requireUser();

  await db
    .delete(products)
    .where(and(eq(products.id, id), eq(products.userId, user.id)));

  revalidatePath("/");
}
