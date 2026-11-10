// =========================================================
// Campo.jsx · Un campo de formulario con su título y su error
// tipo: "text" (por defecto), "number", "textarea" o "select"
// =========================================================
export default function Campo({ etiqueta, nombre, valor, alCambiar, error, tipo = "text", ayuda, opciones = [], ...resto }) {
  const id = `campo-${nombre}`;
  const clase = `form-control ${error ? "is-invalid" : ""}`;
  const cambiar = (evento) => alCambiar(nombre, evento.target.value);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {etiqueta}
      </label>
      {tipo === "textarea" ? (
        <textarea id={id} className={clase} rows={3} value={valor ?? ""} onChange={cambiar} {...resto} />
      ) : tipo === "select" ? (
        <select id={id} className={`form-select ${error ? "is-invalid" : ""}`} value={valor ?? ""} onChange={cambiar} {...resto}>
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} type={tipo} className={clase} value={valor ?? ""} onChange={cambiar} {...resto} />
      )}
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
