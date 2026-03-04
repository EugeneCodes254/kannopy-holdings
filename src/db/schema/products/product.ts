import { pgTable, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";
// import { user } from "./auth";

export const products = pgTable("products", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:       text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  name:         text("name").notNull(),
  category:     text("category").notNull().default("Other"),
  image:        text("image").notNull().default("🛍️"),
  msrp:         real("msrp").notNull(),
  currentPrice: real("currentPrice").notNull(),
  lowestFound:  real("lowestFound").notNull(),
  period:       integer("period").notNull().default(60),
  daysElapsed:  integer("daysElapsed").notNull().default(0),
  status:       text("status").notNull().default("tracking"),
  fraudRisk:    text("fraudRisk").notNull().default("low"),
  createdAt:    timestamp("createdAt").defaultNow(),
  updatedAt:    timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()),
}).enableRLS();

export type Product    = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
