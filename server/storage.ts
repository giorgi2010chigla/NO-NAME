import { db } from "./db";
import {
  addresses,
  cartItems,
  orders,
  type Address,
  type CartItem,
  type Order,
  type NewAddressInput,
  type CartItemInput,
} from "@shared/schema";
import { and, desc, eq } from "drizzle-orm";

export const commerceStorage = {
  // Addresses
  async listAddresses(userId: string): Promise<Address[]> {
    return db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
  },

  async createAddress(userId: string, data: NewAddressInput): Promise<Address> {
    const existing = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(eq(addresses.userId, userId));
    const isFirst = existing.length === 0;

    const [created] = await db
      .insert(addresses)
      .values({
        userId,
        recipientName: data.recipientName,
        line1: data.line1,
        line2: data.line2 ?? null,
        city: data.city,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone ?? null,
        isDefault: isFirst ? 1 : 0,
      })
      .returning();
    return created;
  },

  async getAddress(userId: string, id: string): Promise<Address | undefined> {
    const [row] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)));
    return row;
  },

  async deleteAddress(userId: string, id: string): Promise<void> {
    await db
      .delete(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)));
  },

  // Cart
  async getCart(userId: string): Promise<CartItem[]> {
    return db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .orderBy(desc(cartItems.createdAt));
  },

  async addToCart(userId: string, item: CartItemInput): Promise<CartItem> {
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, item.productId)
        )
      );

    const match = existing.find(
      (e) => (e.size ?? null) === (item.size ?? null) && (e.color ?? null) === (item.color ?? null)
    );

    if (match) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: match.quantity + item.quantity })
        .where(eq(cartItems.id, match.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(cartItems)
      .values({
        userId,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        unitPrice: item.unitPrice,
        size: item.size ?? null,
        color: item.color ?? null,
        quantity: item.quantity,
      })
      .returning();
    return created;
  },

  async updateCartItem(
    userId: string,
    id: string,
    quantity: number
  ): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await this.removeCartItem(userId, id);
      return undefined;
    }
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(and(eq(cartItems.userId, userId), eq(cartItems.id, id)))
      .returning();
    return updated;
  },

  async removeCartItem(userId: string, id: string): Promise<void> {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.id, id)));
  },

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  },

  // Orders
  async createOrder(input: {
    userId: string;
    paymentMethod: string;
    paymentReference?: string | null;
    subtotalCents: number;
    totalCents: number;
    shippingAddress: Address;
    items: CartItem[];
  }): Promise<Order> {
    const [created] = await db
      .insert(orders)
      .values({
        userId: input.userId,
        status: "received",
        paymentMethod: input.paymentMethod,
        paymentReference: input.paymentReference ?? null,
        subtotalCents: input.subtotalCents,
        totalCents: input.totalCents,
        shippingAddress: input.shippingAddress,
        items: input.items,
      })
      .returning();
    return created;
  },

  async listOrders(userId: string): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  },
};
