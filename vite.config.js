import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Frances Logistics System',
        short_name: 'FrancesLogistics',
        description: 'Frances Logistics Admin & Shipping System',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Increases the maximum size of files that can be cached (useful for large bundles)
        maximumFileSizeToCacheInBytes: 5000000,
      }
    })
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
