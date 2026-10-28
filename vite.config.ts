import { defineConfig, type Plugin } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { onRequestGet } from "./functions/api/status.js";

const statusApi = {
  name: "status-api",
  configureServer(server) {
    server.middlewares.use("/api/status", async (_request, response) => {
      const result = await onRequestGet();
      response.statusCode = result.status;
      result.headers.forEach((value, key) => response.setHeader(key, value));
      response.end(await result.text());
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use("/api/status", async (_request, response) => {
      const result = await onRequestGet();
      response.statusCode = result.status;
      result.headers.forEach((value, key) => response.setHeader(key, value));
      response.end(await result.text());
    });
  },
} satisfies Plugin;

export default defineConfig({
  plugins: [svelte(), statusApi],
});
