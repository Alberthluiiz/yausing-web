// BotonesFormulario.jsx · "Cancelar" y "Guardar" al final de cada formulario del panel
export default function BotonesFormulario({ guardando, alCancelar }) {
  return (
    <div className="d-flex gap-2 justify-content-end">
      <button type="button" className="btn btn-light rounded-pill px-4" onClick={alCancelar}>
        Cancelar
      </button>
      <button type="submit" className="btn btn-rojo rounded-pill px-4" disabled={guardando}>
        {guardando ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}
