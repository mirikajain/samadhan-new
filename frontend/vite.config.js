import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://samadhan-new-2.onrender.com", // backend server URL
        changeOrigin: true,
      },
    },
  },
});

