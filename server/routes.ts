import type { Express, Request, Response } from "express";
import express from "express";
import { isAuthenticated } from "./replit_integrations/auth";
import { commerceStorage } from "./storage";
import {
  cartItemInputSchema,
  checkoutInputSchema,
  insertAddressSchema,
} from "@shared/schema";
import { sendEmail } from "./utils/replitmail";
import { authStorage } from "./replit_integrations/auth/storage";

function userId(req: Request): string {
  return (req.user as any).claims.sub;
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function registerCommerceRoutes(app: Express) {
  app.use(express.json({ limit: "1mb" }));

  // ---------- Addresses ----------
  app.get("/api/addresses", isAuthenticated, async (req, res) => {
    try {
      const list = await commerceStorage.listAddresses(userId(req));
      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load addresses" });
    }
  });

  app.post("/api/addresses", isAuthenticated, async (req, res) => {
    try {
      const data = insertAddressSchema.parse(req.body);
      const created = await commerceStorage.createAddress(userId(req), data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err?.issues) return res.status(400).json({ issues: err.issues });
      console.error(err);
      res.status(500).json({ message: "Failed to save address" });
    }
  });

  app.delete("/api/addresses/:id", isAuthenticated, async (req, res) => {
    try {
      await commerceStorage.deleteAddress(userId(req), req.params.id);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete address" });
    }
  });

  // ---------- Cart ----------
  app.get("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const items = await commerceStorage.getCart(userId(req));
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const data = cartItemInputSchema.parse(req.body);
      const created = await commerceStorage.addToCart(userId(req), data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err?.issues) return res.status(400).json({ issues: err.issues });
      console.error(err);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const quantity = Number(req.body?.quantity ?? 0);
      if (!Number.isFinite(quantity)) return res.status(400).json({ message: "Invalid quantity" });
      const updated = await commerceStorage.updateCartItem(
        userId(req),
        req.params.id,
        quantity
      );
      res.json(updated ?? null);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      await commerceStorage.removeCartItem(userId(req), req.params.id);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", isAuthenticated, async (req, res) => {
    try {
      await commerceStorage.clearCart(userId(req));
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // ---------- Checkout ----------
  app.post("/api/checkout", isAuthenticated, async (req, res) => {
    try {
      const input = checkoutInputSchema.parse(req.body);
      const uid = userId(req);

      const [address, items, user] = await Promise.all([
        commerceStorage.getAddress(uid, input.addressId),
        commerceStorage.getCart(uid),
        authStorage.getUser(uid),
      ]);

      if (!address) return res.status(400).json({ message: "Shipping address not found" });
      if (items.length === 0) return res.status(400).json({ message: "Cart is empty" });

      const subtotalCents = items.reduce(
        (sum, i) => sum + i.unitPrice * 100 * i.quantity,
        0
      );
      const totalCents = subtotalCents;

      const order = await commerceStorage.createOrder({
        userId: uid,
        paymentMethod: input.paymentMethod,
        paymentReference: input.paymentReference ?? null,
        subtotalCents,
        totalCents,
        shippingAddress: address,
        items,
      });

      // Clear cart
      await commerceStorage.clearCart(uid);

      // Send email notification (best-effort, non-blocking for response)
      const itemsHtml = items
        .map(
          (i) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${i.productName}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${i.color ?? "—"} / ${i.size ?? "—"}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(i.unitPrice * 100 * i.quantity)}</td>
          </tr>`
        )
        .join("");

      const itemsText = items
        .map(
          (i) =>
            `- ${i.productName} (${i.color ?? "—"} / ${i.size ?? "—"}) x${i.quantity} — ${formatMoney(i.unitPrice * 100 * i.quantity)}`
        )
        .join("\n");

      const paymentLabel =
        input.paymentMethod === "google_pay"
          ? "Google Pay"
          : input.paymentMethod === "visa"
          ? "Visa"
          : "Mastercard";

      const html = `
        <div style="font-family:Helvetica,Arial,sans-serif;color:#111;">
          <h1 style="text-transform:uppercase;letter-spacing:.1em;font-size:18px;">New NO NAME order</h1>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${user?.firstName ?? ""} ${user?.lastName ?? ""} &lt;${user?.email ?? ""}&gt;</p>
          <p><strong>Payment:</strong> ${paymentLabel}${order.paymentReference ? ` (ref ${order.paymentReference})` : ""}</p>

          <h2 style="text-transform:uppercase;letter-spacing:.1em;font-size:14px;margin-top:24px;">Shipping address</h2>
          <p style="line-height:1.5">
            ${address.recipientName}<br/>
            ${address.line1}${address.line2 ? `<br/>${address.line2}` : ""}<br/>
            ${address.city}, ${address.region} ${address.postalCode}<br/>
            ${address.country}${address.phone ? `<br/>Phone: ${address.phone}` : ""}
          </p>

          <h2 style="text-transform:uppercase;letter-spacing:.1em;font-size:14px;margin-top:24px;">Items</h2>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="text-align:left;border-bottom:2px solid #111;">
                <th style="padding:8px;">Item</th>
                <th style="padding:8px;">Color / Size</th>
                <th style="padding:8px;text-align:center;">Qty</th>
                <th style="padding:8px;text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:bold;">Total</td>
                <td style="padding:12px 8px;text-align:right;font-weight:bold;">${formatMoney(totalCents)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;

      const text = `New NO NAME order
Order ID: ${order.id}
Customer: ${user?.firstName ?? ""} ${user?.lastName ?? ""} <${user?.email ?? ""}>
Payment: ${paymentLabel}${order.paymentReference ? ` (ref ${order.paymentReference})` : ""}

Shipping address:
${address.recipientName}
${address.line1}${address.line2 ? `\n${address.line2}` : ""}
${address.city}, ${address.region} ${address.postalCode}
${address.country}${address.phone ? `\nPhone: ${address.phone}` : ""}

Items:
${itemsText}

Total: ${formatMoney(totalCents)}
`;

      sendEmail({
        subject: `New NO NAME order — ${formatMoney(totalCents)}`,
        text,
        html,
      }).catch((mailErr) => {
        console.error("[mail] Failed to send order email:", mailErr);
      });

      res.status(201).json(order);
    } catch (err: any) {
      if (err?.issues) return res.status(400).json({ issues: err.issues });
      console.error(err);
      res.status(500).json({ message: "Checkout failed" });
    }
  });

  // ---------- Orders ----------
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const list = await commerceStorage.listOrders(userId(req));
      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load orders" });
    }
  });
}
