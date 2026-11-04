// =========================================================
// ofertas.js · Muestra las tarjetas de ofertas
// =========================================================

import { COLORES_OFERTA } from "../config.js";
import { textoSeguro, numeroSeguro, opcionSegura, ponerImagen } from "./seguridad.js";
import { copiarPlantilla, campo, escribirPrecio } from "./utilidades.js";
import { enlaceWhatsapp } from "./whatsapp.js";

function crearOferta(oferta) {
  const nombre = textoSeguro(oferta.nombre, 80);
  const antes = numeroSeguro(oferta.antes);
  const ahora = numeroSeguro(oferta.ahora);
  // El descuento se calcula solo: (1 - ahora / antes) × 100
  const descuento = antes > 0 ? Math.round((1 - ahora / antes) * 100) : 0;
  const color = opcionSegura(oferta.color, COLORES_OFERTA, "rojo");

  const tarjeta = copiarPlantilla("plantilla-oferta");
  tarjeta.querySelector(".oferta").style.setProperty("--color-oferta", `var(--${color})`);

  ponerImagen(campo(tarjeta, "foto"), oferta.foto, nombre);
  campo(tarjeta, "descuento").textContent = `-${descuento}%`;
  campo(tarjeta, "nombre").textContent = nombre;
  campo(tarjeta, "descripcion").textContent = textoSeguro(oferta.descripcion, 160);
  escribirPrecio(campo(tarjeta, "ahora"), ahora);
  campo(tarjeta, "antes").textContent = `$${antes.toFixed(2)}`;
  campo(tarjeta, "whatsapp").href = enlaceWhatsapp(`Hola, quiero la oferta: ${nombre}`);

  return tarjeta;
}

export function iniciarOfertas(ofertas) {
  document.getElementById("lista-ofertas").replaceChildren(...ofertas.map(crearOferta));
}
