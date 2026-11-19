// =========================================================
// Confirmar.jsx · Ventana "¿Seguro que quieres borrar?"
// Se usa junto con hooks/useConfirmar.js.
// "Cancelar", Esc o tocar afuera = no se borra nada.
// =========================================================
import Ventana from "../comunes/Ventana";

export default function Confirmar({ pregunta, alResponder }) {
  if (!pregunta) return null;
  const no = () => alResponder(false);

  return (
    <Ventana titulo={pregunta.titulo} alCerrar={no} className="ventana-confirmar">
      <div className="p-2 pt-4 text-center">
        <i className="bi bi-exclamation-triangle-fill text-danger fs-1" aria-hidden="true" />
        <h2 className="h5 admin-titulo mt-2">{pregunta.titulo}</h2>
        {pregunta.texto && <p className="text-secondary">{pregunta.texto}</p>}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          <button type="button" className="btn btn-light rounded-pill px-4" onClick={no}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger rounded-pill px-4" onClick={() => alResponder(true)}>
            <i className="bi bi-trash3 me-1" />
            {pregunta.boton ?? "Sí, borrar"}
          </button>
        </div>
      </div>
    </Ventana>
  );
}
