// useTituloPagina.js · Cambia el título de la pestaña del navegador
import { useEffect } from "react";

export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Yausig Churikuna` : "Yausig Churikuna · Ropa indígena en Quito";
  }, [titulo]);
}
