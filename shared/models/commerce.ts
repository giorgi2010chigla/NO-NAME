import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./auth";

export const addresses = pgTable("addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recipientName: varchar("recipient_name", { length: 200 }).notNull(),
  line1: varchar("line1", { length: 300 }).notNull(),
  line2: varchar("line2", { length: 300 }),
  city: varchar("city", { length: 120 }).notNull(),
  region: varchar("region", { length: 120 }).notNull(),
  postalCode: varchar("postal_code", { length: 30 }).notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  isDefault: integer("is_default").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: varchar("product_name", { length: 200 }).notNull(),
  productImage: varchar("product_image", { length: 400 }).notNull(),
  unitPrice: integer("unit_price").notNull(),
  size: varchar("size", { length: 30 }),
  color: varchar("color", { length: 60 }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  paymentMethod: varchar("payment_method", { length: 40 }).notNull(),
  paymentReference: varchar("payment_reference", { length: 200 }),
  subtotalCents: integer("subtotal_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  items: jsonb("items").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  cartItems: many(cartItems),
  orders: many(orders),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));

export type Address = typeof addresses.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;

export const insertAddressSchema = createInsertSchema(addresses, {
  recipientName: z.string().min(1).max(200),
  line1: z.string().min(1).max(300),
  line2: z.string().max(300).nullable().optional(),
  city: z.string().min(1).max(120),
  region: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(30),
  country: z.string().min(1).max(120),
  phone: z.string().max(40).nullable().optional(),
}).omit({ id: true, userId: true, createdAt: true, isDefault: true });

export type NewAddressInput = z.infer<typeof insertAddressSchema>;

export const cartItemInputSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1).max(200),
  productImage: z.string().min(1).max(400),
  unitPrice: z.number().int().nonnegative(),
  size: z.string().max(30).nullable().optional(),
  color: z.string().max(60).nullable().optional(),
  quantity: z.number().int().min(1).max(99),
});

export type CartItemInput = z.infer<typeof cartItemInputSchema>;

export const checkoutInputSchema = z.object({
  addressId: z.string().min(1),
  paymentMethod: z.enum(["visa", "mastercard", "google_pay"]),
  paymentReference: z.string().max(200).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
