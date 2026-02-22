import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/toDoList/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "To-Do List — Pastel",
        short_name: "To-Do Pastel",
        description:
          "Gérez vos tâches avec priorités personnalisables, favoris et filtres.",
        start_url: "/toDoList/",
        scope: "/toDoList/",
        display: "standalone",
        theme_color: "#5c6bc0",
        background_color: "#f5f1f7",
        lang: "fr",
        icons: [
          {
            src: "/toDoList/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/toDoList/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
