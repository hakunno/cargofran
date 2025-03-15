import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/cargofran/", // ✅ If deploying in a subdirectory, set this correctly
  server: {
    historyApiFallback: true, // ✅ Fixes React Router 404 issue on refresh
  },
});
