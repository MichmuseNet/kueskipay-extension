import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        background: "src/background/background.js",
        content: "src/content/content.js",
      },
      output: {
        entryFileNames: "src/[name]/[name].js",
      },
    },
  },
});