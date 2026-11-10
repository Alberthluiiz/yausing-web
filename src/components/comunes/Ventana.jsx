// =========================================================
// Ventana.jsx · Ventana que se abre encima de la página
// - Se cierra con la X, con la tecla Esc o tocando afuera
// - Mientras está abierta, la página de atrás no se mueve
// =========================================================
import { useEffect, useRef } from "react";

export default function Ventana({ titulo, alCerrar, children, className = "" }) {
  const ref = useRef(null);
  const cerrarRef = useRef(alCerrar);
  cerrarRef.current = alCerrar; // siempre la versión más nueva, sin repetir el efecto

  useEffect(() => {
    const alPresionar = (evento) => evento.key === "Escape" && cerrarRef.current();
    const anterior = document.activeElement; // para devolver el foco al cerrar
    document.addEventListener("keydown", alPresionar);
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = "";
      anterior?.focus?.();
    };
  }, []);

  return (
    <div className="ventana-fondo" onMouseDown={(evento) => evento.target === evento.currentTarget && alCerrar()}>
      <div ref={ref} className={`ventana ${className}`} role="dialog" aria-modal="true" aria-label={titulo} tabIndex={-1}>
        <button type="button" className="ventana-cerrar" onClick={alCerrar} aria-label="Cerrar">
          <i className="bi bi-x-lg" />
        </button>
        {children}
      </div>
    </div>
  );
}
