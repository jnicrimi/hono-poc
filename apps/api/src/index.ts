import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { loadEnv } from "./shared/config/env";

const env = loadEnv();

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }, 200));

serve({ fetch: app.fetch, port: env.PORT });
