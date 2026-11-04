// =========================================================
// contacto.js · Datos del local, mapa, redes y fotos fijas
// =========================================================

import { textoSeguro, enlaceSeguro, mapaSeguro, ponerImagen } from "./seguridad.js";

// Escribe un texto en el elemento con ese id (solo si el texto no está vacío)
function escribir(id, valor) {
  const texto = textoSeguro(valor);
  if (texto) document.getElementById(id).textContent = texto;
}

export function iniciarContacto(tienda) {
  escribir("contacto-direccion", tienda.direccion);
  escribir("contacto-referencia", tienda.referencia);
  escribir("contacto-telefono", tienda.telefonoVisible);

  // Horario: cada línea del JSON va en una línea distinta
  if (Array.isArray(tienda.horario)) {
    const horario = document.getElementById("contacto-horario");
    horario.replaceChildren();
    tienda.horario.forEach((linea, i) => {
      if (i > 0) horario.append(document.createElement("br"));
      horario.append(textoSeguro(linea, 80));
    });
  }

  // Mapa: solo se acepta un enlace de Google Maps
  const mapa = mapaSeguro(tienda.mapa);
  if (mapa) document.getElementById("mapa").src = mapa;

  // Redes: si hay enlace se activa; si está vacío se queda "muy pronto"
  const redes = tienda.redes ?? {};
  let hayRedes = false;
  document.querySelectorAll("[data-red]").forEach((icono) => {
    const enlace = enlaceSeguro(redes[icono.dataset.red]);
    if (enlace) {
      icono.href = enlace;
      icono.target = "_blank";
      icono.rel = "noopener noreferrer";
      hayRedes = true;
    }
  });
  if (hayRedes) document.getElementById("redes-texto").textContent = "Síguenos";
}

// Fotos de la portada y de Nosotros (vienen de "imagenes" en el JSON)
export function iniciarImagenes(imagenes) {
  if (imagenes.portadaGrande) ponerImagen(document.getElementById("foto-portada-grande"), imagenes.portadaGrande, "Prenda destacada");
  if (imagenes.portadaChica) ponerImagen(document.getElementById("foto-portada-chica"), imagenes.portadaChica, "Prenda destacada");
  if (imagenes.nosotros) ponerImagen(document.getElementById("foto-nosotros"), imagenes.nosotros, "Yausig Churikuna");
}
