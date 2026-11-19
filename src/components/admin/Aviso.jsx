// =========================================================
// Aviso.jsx · Mensaje verde (todo bien) o rojo (error) que
// flota arriba de la pantalla: se ve aunque hayas bajado la
// página o tengas un formulario abierto.
// - Los verdes se cierran solos a los 4 segundos.
// - Los rojos se quedan hasta que tocas la X.
// =========================================================
import { useEffect } from "react";

export default function Aviso({ aviso, alCerrar }) {
  useEffect(() => {
    if (aviso?.tipo !== "ok") return;
    const id = setTimeout(alCerrar, 4000);
    return () => clearTimeout(id);
  }, [aviso, alCerrar]);

  if (!aviso) return null;
  const ok = aviso.tipo === "ok";
  return (
    <div
      className={`aviso-flotante alert ${ok ? "alert-success" : "alert-danger"} d-flex align-items-center`}
      role={ok ? "status" : "alert"}
    >
      <i className={`bi ${ok ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`} />
      <span className="flex-grow-1">{aviso.texto}</span>
      <button type="button" className="btn-close ms-2" onClick={alCerrar} aria-label="Cerrar aviso" />
    </div>
  );
}
