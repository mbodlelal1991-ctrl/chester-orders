import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/chester-orders/",
  plugins: [react()],
  define: { global: "globalThis" },
});