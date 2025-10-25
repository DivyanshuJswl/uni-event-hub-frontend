import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      assets: path.resolve(__dirname, "./src/assets"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      context: path.resolve(__dirname, "./src/context"),
      examples: path.resolve(__dirname, "./src/examples"),
    },
  },
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          axios: ["axios"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: "globalThis", // Add global definition
  },
});
