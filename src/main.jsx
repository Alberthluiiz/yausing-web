// =========================================================
// main.jsx · Punto de arranque: carga estilos y dibuja la App
// =========================================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 1. Bootstrap (rejilla, botones, formularios) e iconos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

// 2. Letras (se guardan dentro de la web, sin depender de Google)
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/600-italic.css";

// 3. Nuestros estilos (styles/index.css junta todos)
import "./styles/index.css";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
