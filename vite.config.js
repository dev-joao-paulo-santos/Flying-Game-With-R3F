import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["wkmxx8-5173.csb.app"], // 🔥 Adiciona o host dinâmico do CodeSandbox
    host: true, // Permite acessos externos
  },
  plugins: [react()],
});
