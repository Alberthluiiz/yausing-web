// Interruptor.jsx · Botón de encendido/apagado (ej: "Mostrar en la web")
export default function Interruptor({ etiqueta, nombre, valor, alCambiar }) {
  return (
    <div className="form-check form-switch mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={`interruptor-${nombre}`}
        checked={Boolean(valor)}
        onChange={(evento) => alCambiar(nombre, evento.target.checked)}
      />
      <label className="form-check-label" htmlFor={`interruptor-${nombre}`}>
        {etiqueta}
      </label>
    </div>
  );
}
