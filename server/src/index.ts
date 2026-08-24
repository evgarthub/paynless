import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import utilitiesRoutes from "./routes/utilities";
import tariffsRoutes from "./routes/tariffs";
import billsRoutes from "./routes/bills";
import readingsRoutes from "./routes/readings";
import { startCronWorker } from "./services/cron";
import { runMigrations } from "./db/migrate";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

app.route("/api/utilities", utilitiesRoutes);
app.route("/api/tariffs", tariffsRoutes);
app.route("/api/bills", billsRoutes);
app.route("/api/readings", readingsRoutes);

app.get("/api/health", (c) => c.json({ ok: true }));

app.get("/docs", swaggerUI({ url: "/api/swagger" }));

app.get("/api/swagger", (c) => {
  return c.json({
    openapi: "3.0.0",
    info: { title: "Paynless API", version: "2.0.0" },
    paths: {
      "/api/utilities": { get: { summary: "List utilities" } },
      "/api/bills": { get: { summary: "List bills" } },
      "/api/health": { get: { summary: "Health check" } },
    },
  });
});

const PORT = parseInt(process.env.PORT || "3000", 10);

runMigrations();
startCronWorker();

console.log(`Server running on port ${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
