// =========================================================
// seguridad.js · Revisa los datos ANTES de mostrarlos
//
// React ya muestra todo como texto (nunca ejecuta código escondido
// en un nombre o descripción). Aquí además revisamos los ENLACES,
// porque un enlace "javascript:..." sí podría ser peligroso.
// =========================================================

// Texto limpio y con largo máximo. Si no es texto, devuelve "".
export function textoSeguro(valor, maximo = 300) {
  if (typeof valor !== "string") return "";
  return valor.trim().slice(0, maximo);
}

// Solo enlaces https (redes sociales)
export function enlaceSeguro(enlace) {
  const texto = textoSeguro(enlace, 300);
  try {
    const url = new URL(texto);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

// Solo mapas de Google Maps
export function mapaSeguro(enlace) {
  const seguro = enlaceSeguro(enlace);
  return seguro.startsWith("https://www.google.com/maps") ? seguro : "";
}

// Deja solo números (quita espacios, +, guiones)
export function soloNumeros(texto) {
  return String(texto ?? "").replace(/\D/g, "");
}

// Ruta de foto válida dentro del depósito (ej: productos/saco-1.webp)
export function rutaFotoValida(ruta) {
  return typeof ruta === "string" && /^[a-z0-9/_.-]+$/.test(ruta) && !ruta.includes("..");
}
