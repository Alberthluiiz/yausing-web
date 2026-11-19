// =========================================================
// Buscador.jsx · Campo para buscar en las listas del panel
// (con lupa y una X para borrar lo escrito).
// Para filtrar se usa utils/formato.js#coincide: no importan
// las tildes ni las mayúsculas ("nusta" encuentra "Ñusta").
// =========================================================
export default function Buscador({ valor, alCambiar, texto = "Buscar por nombre..." }) {
  return (
    <div className="buscador mb-3">
      <i className="bi bi-search" aria-hidden="true" />
      <input
        type="search"
        className="form-control"
        placeholder={texto}
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        aria-label={texto}
      />
      {valor && (
        <button type="button" onClick={() => alCambiar("")} aria-label="Borrar búsqueda">
          <i className="bi bi-x-lg" />
        </button>
      )}
    </div>
  );
}
