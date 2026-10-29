import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Backend Java: gerenciamento do acervo e consultas bibliográficas
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});