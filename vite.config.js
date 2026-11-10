// =========================================================
// vite.config.js · Configuración de Vite (el programa que
// arranca la web en tu PC y la "empaqueta" para publicarla)
// =========================================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // SEGURIDAD: no publica los "mapas" del código fuente
    sourcemap: false,
  },
});
