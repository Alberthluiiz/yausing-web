// =========================================================
// whatsapp.js · Crea los enlaces de WhatsApp
// =========================================================

import { numeroWhatsappSeguro, textoSeguro } from "./seguridad.js";

let numeroWhatsapp = "";

// Guarda el número que viene en tienda.json
export function configurarWhatsapp(numero) {
  numeroWhatsapp = numeroWhatsappSeguro(numero);
}

// Devuelve el enlace de WhatsApp con un mensaje ya escrito
export function enlaceWhatsapp(mensaje) {
  const texto = encodeURIComponent(textoSeguro(mensaje, 300));
  return `https://wa.me/${numeroWhatsapp}?text=${texto}`;
}

// Pone el enlace en todos los botones con la clase "enlace-whatsapp"
export function activarBotonesWhatsapp(mensaje) {
  document.querySelectorAll(".enlace-whatsapp").forEach((boton) => {
    boton.href = enlaceWhatsapp(mensaje);
  });
}
