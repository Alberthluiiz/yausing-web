// Aviso.jsx · Mensaje verde (todo bien) o rojo (error) arriba del panel
import { useEffect } from "react";

export default function Aviso({ aviso, alCerrar }) {
  // Los avisos verdes se cierran solos a los 4 segundos
  useEffect(() => {
    if (aviso?.tipo !== "ok") return;
    const id = setTimeout(alCerrar, 4000);
    return () => clearTimeout(id);
  }, [aviso, alCerrar]);

  if (!aviso) return null;
  return (
    <div className={`alert ${aviso.tipo === "ok" ? "alert-success" : "alert-danger"} d-flex align-items-center`} role="alert">
      <i className={`bi ${aviso.tipo === "ok" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`} />
      <span className="flex-grow-1">{aviso.texto}</span>
      <button type="button" className="btn-close" onClick={alCerrar} aria-label="Cerrar aviso" />
    </div>
  );
}
