// ===== CONFIGURACIÓN =====
// Número de WhatsApp de Mary: 593 (Ecuador) + número sin el 0 inicial
const WHATSAPP = "593961380728";

// ===== LISTA DE OFERTAS =====
// Para agregar, quitar o cambiar un producto, solo edita esta lista.
const ofertas = [
  { nombre: "Blusa bordada", precio: 35.0, descuento: 25, icono: "👚" },
  { nombre: "Anaco tradicional", precio: 40.0, descuento: 20, icono: "👗" },
  { nombre: "Poncho de lana", precio: 60.0, descuento: 30, icono: "🧥" },
  { nombre: "Fachalina", precio: 18.0, descuento: 15, icono: "🧣" },
];

// ===== CREAR UNA TARJETA =====
// Recibe un producto y devuelve el HTML de su tarjeta.
function crearTarjeta(oferta) {
  const precioFinal = oferta.precio * (1 - oferta.descuento / 100);
  const mensaje = encodeURIComponent(`Hola, me interesa: ${oferta.nombre}`);

  return `
    <div class="col">
      <div class="card oferta h-100 border-0 shadow-sm">
        <div class="oferta-imagen">
          <span class="badge oferta-descuento">-${oferta.descuento}%</span>
          ${oferta.icono}
        </div>
        <div class="card-body">
          <h3 class="h6 fw-semibold">${oferta.nombre}</h3>
          <p class="mb-3">
            <span class="fw-bold text-rojo">$${precioFinal.toFixed(2)}</span>
            <small class="text-secondary text-decoration-line-through ms-1">$${oferta.precio.toFixed(2)}</small>
          </p>
          <a href="https://wa.me/${WHATSAPP}?text=${mensaje}" target="_blank"
             class="btn btn-outline-dark rounded-pill w-100">
            Lo quiero
          </a>
        </div>
      </div>
    </div>
  `;
}

// ===== MOSTRAR LAS OFERTAS EN LA PÁGINA =====
const contenedor = document.getElementById("lista-ofertas");
contenedor.innerHTML = ofertas.map(crearTarjeta).join("");

// ===== CERRAR EL MENÚ DEL CELULAR AL ELEGIR UNA OPCIÓN =====
document.querySelectorAll("#menuPrincipal .nav-link").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const menu = bootstrap.Collapse.getOrCreateInstance("#menuPrincipal", {
      toggle: false,
    });
    menu.hide();
  });
});

// ===== CONTACTO =====
// Botón grande de WhatsApp con un mensaje ya escrito
const mensajeContacto = encodeURIComponent(
  "Hola, vi su página y quiero más información.",
);
document.getElementById("boton-whatsapp").href =
  `https://wa.me/${WHATSAPP}?text=${mensajeContacto}`;

// Muestra el número de forma bonita: +593 96 138 0728
document.getElementById("telefono").textContent =
  `+${WHATSAPP.slice(0, 3)} ${WHATSAPP.slice(3, 5)} ${WHATSAPP.slice(5, 8)} ${WHATSAPP.slice(8)}`;
