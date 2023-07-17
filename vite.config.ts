import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "ESNext",
    rollupOptions: {
      input: {
        app: resolve(__dirname, "./src/index.html"),
        content: resolve(__dirname, "./src/pages/content/index.ts"),
        background: resolve(__dirname, "./src/pages/background/index.ts"),
        injector: resolve(__dirname, "./src/pages/content/injector.ts"),
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
  plugins: [react(), crx({ manifest })],
});
