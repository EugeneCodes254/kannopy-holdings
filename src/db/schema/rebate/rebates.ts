import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { products } from "../products";
// import { user } from "./auth";
// import { products } from "./products";

export const rebates = pgTable("rebates", {
  id:         text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:     text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  productId:  text("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
  msrp:       real("msrp").notNull(),
  paidPrice:  real("paidPrice").notNull(),
  gross:      real("gross").notNull(),       // msrp - paidPrice
  fee:        real("fee").notNull(),         // gross * 0.15
  net:        real("net").notNull(),         // gross - fee
  status: text("status", { enum: ["pending", "processing", "paid"] }).notNull().default("pending"),
  createdAt:  timestamp("createdAt").defaultNow(),
  updatedAt:  timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()),
}).enableRLS();

export type Rebate    = typeof rebates.$inferSelect;
export type NewRebate = typeof rebates.$inferInsert;
