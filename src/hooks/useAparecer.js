// =========================================================
// useAparecer.js · Animación suave cuando una sección aparece
// al bajar con el mouse o el dedo.
//
// Uso:  const ref = useAparecer();   <div ref={ref} className="aparecer">
// =========================================================

import { useEffect, useRef } from "react";

export function useAparecer() {
  const ref = useRef(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // Si la persona prefiere menos animaciones, se muestra de una vez
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elemento.classList.add("visible");
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          elemento.classList.add("visible");
          observador.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return ref;
}
