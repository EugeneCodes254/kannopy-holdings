"use server";

import { db } from "@/db";
import { rebates } from "@/db/schema";
// import { getSession } from "@/lib/auth-client";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  // getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

// ── GET all rebates for current user ──────────────────────────────────────────
export async function getRebates() {
  const user = await requireUser();
  return db
    .select()
    .from(rebates)
    .where(eq(rebates.userId, user.id))
    .orderBy(rebates.createdAt);
}

// ── CREATE a rebate when a deal is cashed out ─────────────────────────────────
export async function createRebate(data: {
  productId:  string;
  msrp:       number;
  paidPrice:  number;
}) {
  const user = await requireUser();

  const gross = data.msrp - data.paidPrice;
  const fee   = parseFloat((gross * 0.15).toFixed(2));
  const net   = parseFloat((gross - fee).toFixed(2));

  const [rebate] = await db
    .insert(rebates)
    .values({
      userId:    user.id,
      productId: data.productId,
      msrp:      data.msrp,
      paidPrice: data.paidPrice,
      gross,
      fee,
      net,
      status:    "pending",
    })
    .returning();

  revalidatePath("/");
  return rebate;
}

// ── UPDATE rebate status (pending → processing → paid) ────────────────────────
export async function updateRebateStatus(id: string, status: "pending" | "processing" | "paid") {
  const user = await requireUser();

  const [updated] = await db
    .update(rebates)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(rebates.id, id), eq(rebates.userId, user.id)))
    .returning();

  revalidatePath("/");
  return updated;
}
