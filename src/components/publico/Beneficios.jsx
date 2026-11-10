// =========================================================
// Beneficios.jsx · Tarjeta blanca con los 4 beneficios
// (va debajo de la portada, montada sobre ella).
// Para cambiar un beneficio, cambia esta lista.
// =========================================================
const BENEFICIOS = [
  { icono: "bi-truck", color: "icono-naranja", titulo: "Envíos a todo el Ecuador", texto: "Rápido y seguro" },
  { icono: "bi-credit-card-2-front", color: "icono-amarillo", titulo: "Pago por transferencia", texto: "Fácil y seguro" },
  { icono: "bi-arrow-repeat", color: "icono-verde", titulo: "Cambios de talla", texto: "Si no te queda" },
  { icono: "bi-heart", color: "icono-rojo", titulo: "Atención con cariño", texto: "Te asesoramos por WhatsApp" },
];

export default function Beneficios() {
  return (
    <div className="beneficios" role="list" aria-label="Beneficios">
      {BENEFICIOS.map((beneficio) => (
        <div className="beneficio" role="listitem" key={beneficio.titulo}>
          <span className={`beneficio-icono ${beneficio.color}`}>
            <i className={`bi ${beneficio.icono}`} />
          </span>
          <div>
            <strong>{beneficio.titulo}</strong>
            <small>{beneficio.texto}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
