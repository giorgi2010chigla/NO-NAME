import express from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerCommerceRoutes } from "./routes";

const PORT = Number(process.env.PORT ?? 3001);

async function main() {
  const app = express();

  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = "dev-session-secret-change-in-production";
    console.warn("[server] SESSION_SECRET not set — using insecure dev fallback");
  }

  await setupAuth(app);
  registerAuthRoutes(app);
  registerCommerceRoutes(app);

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`[server] listening on http://127.0.0.1:${PORT}`);
  });
}

main().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
