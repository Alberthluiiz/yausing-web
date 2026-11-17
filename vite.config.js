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
    // VELOCIDAD: separa las librerías en archivos propios. Así, cuando
    // cambias tu código, el navegador del cliente no vuelve a descargar
    // React ni Supabase (ya los tiene guardados).
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: "supabase", test: /node_modules[\\/]@supabase[\\/]/ },
          ],
        },
      },
    },
  },
});
