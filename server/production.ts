import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerCommerceRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT ?? 5000);

async function main() {
  const app = express();

  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set in production");
  }

  await setupAuth(app);
  registerAuthRoutes(app);
  registerCommerceRoutes(app);

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // Serve built client
  const distDir = path.resolve(__dirname, "..", "dist");
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] production listening on :${PORT}`);
  });
}

main().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
