import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: "./",
  server: {
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime (rarely changes)
          vendor: ["react", "react-dom", "react-router-dom"],
          // Firebase SDK (large, but rarely changes)
          firebase: [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/storage",
            "firebase/functions",
          ],
          // UI libraries
          bootstrap: ["react-bootstrap", "bootstrap"],
          // Phone input (sizeable standalone component)
          "phone-input": ["react-phone-number-input"],
        },
      },
    },
  },
});
