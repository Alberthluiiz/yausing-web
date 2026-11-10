// =========================================================
// FilaAdmin.jsx · Una fila de las listas del panel
// (foto, nombre, detalle y botones Mostrar / Editar / Borrar)
// "extra": un botón más, opcional (ej: Agotado en Productos)
//
// Ordenar (opcional): si llegan "indice", "total" y "alMover",
// aparecen flechas ▲▼ (celular y computadora) y la fila se puede
// arrastrar con el mouse (computadora).
// =========================================================
import { useState } from "react";
import Foto from "../comunes/Foto";

export default function FilaAdmin({
  foto,
  titulo,
  detalle,
  publicado = true,
  alPublicar,
  alEditar,
  alBorrar,
  extra,
  indice,
  total,
  alMover,
}) {
  const ordenable = typeof alMover === "function";
  const [encima, setEncima] = useState(false); // otra fila está siendo arrastrada encima

  // Arrastrar y soltar (solo computadora)
  const arrastre = ordenable
    ? {
        draggable: true,
        onDragStart: (evento) => {
          evento.dataTransfer.effectAllowed = "move";
          evento.dataTransfer.setData("text/plain", String(indice));
        },
        onDragOver: (evento) => {
          evento.preventDefault();
          setEncima(true);
        },
        onDragLeave: () => setEncima(false),
        onDrop: (evento) => {
          evento.preventDefault();
          setEncima(false);
          const desde = Number(evento.dataTransfer.getData("text/plain"));
          if (Number.isInteger(desde)) alMover(desde, indice);
        },
      }
    : {};

  return (
    <div className={`fila-admin ${publicado ? "" : "escondido"} ${encima ? "encima" : ""}`} {...arrastre}>
      {ordenable && (
        <div className="flechas-orden">
          <button type="button" disabled={indice === 0} onClick={() => alMover(indice, indice - 1)} aria-label={`Subir ${titulo}`} title="Subir">
            <i className="bi bi-caret-up-fill" />
          </button>
          <i className="bi bi-grip-vertical asa" aria-hidden="true" />
          <button type="button" disabled={indice === total - 1} onClick={() => alMover(indice, indice + 1)} aria-label={`Bajar ${titulo}`} title="Bajar">
            <i className="bi bi-caret-down-fill" />
          </button>
        </div>
      )}
      {foto !== undefined && <Foto ruta={foto} alt="" className="miniatura" />}
      <div className="datos">
        <strong>{titulo}</strong>
        <small>
          {detalle}
          {!publicado && " · Escondido"}
        </small>
      </div>
      <div className="d-flex gap-1 acciones">
        {extra}
        {alPublicar && (
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={alPublicar}
            title={publicado ? "Esconder de la web" : "Mostrar en la web"}
            aria-label={publicado ? "Esconder de la web" : "Mostrar en la web"}
          >
            <i className={`bi ${publicado ? "bi-eye" : "bi-eye-slash"}`} />
          </button>
        )}
        <button type="button" className="btn btn-sm btn-light" onClick={alEditar} title="Editar" aria-label="Editar">
          <i className="bi bi-pencil" />
        </button>
        <button
          type="button"
          className="btn btn-sm btn-light text-danger"
          onClick={alBorrar}
          title="Borrar"
          aria-label="Borrar"
        >
          <i className="bi bi-trash3" />
        </button>
      </div>
    </div>
  );
}
