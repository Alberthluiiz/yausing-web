// =========================================================
// seguridad.js · Revisa los datos antes de ponerlos en la página
//
// ¿Por qué? Si alguien cambia el JSON con algo raro (por ejemplo,
// código escondido en un nombre), estas funciones lo bloquean.
// Además, en toda la página usamos "textContent" en vez de "innerHTML":
// así el texto siempre se muestra como texto y nunca se ejecuta.
// =========================================================

import { CARPETA_IMAGENES, IMAGEN_RESPALDO, INICIO_MAPA } from "../config.js";

// Devuelve un texto limpio (sin espacios de más). Si no es texto, devuelve "".
export function textoSeguro(valor, maximo = 200) {
  if (typeof valor !== "string") return "";
  return valor.trim().slice(0, maximo);
}

// Devuelve un número válido y positivo. Si no lo es, devuelve 0.
export function numeroSeguro(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 ? numero : 0;
}

// Acepta solo imágenes que estén dentro de la carpeta img/
// y que terminen en .png, .jpg, .jpeg, .webp o .svg
export function rutaImagenSegura(ruta) {
  const texto = textoSeguro(ruta, 300);
  const esDeLaCarpeta = texto.startsWith(CARPETA_IMAGENES);
  const noSaleDeLaCarpeta = !texto.includes("..");
  const esImagen = /\.(png|jpe?g|webp|svg)$/i.test(texto);
  return esDeLaCarpeta && noSaleDeLaCarpeta && esImagen
    ? texto
    : IMAGEN_RESPALDO;
}

// Acepta solo colores escritos como #RGB o #RRGGBB (ejemplo: #a71916)
export function colorSeguro(color) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : "#cccccc";
}

// Acepta solo un valor que esté en la lista permitida
export function opcionSegura(valor, permitidos, porDefecto) {
  return permitidos.includes(valor) ? valor : porDefecto;
}

// Acepta solo enlaces https (para redes sociales)
export function enlaceSeguro(enlace) {
  const texto = textoSeguro(enlace, 300);
  return texto.startsWith("https://") ? texto : "";
}

// Acepta solo mapas de Google Maps
export function mapaSeguro(enlace) {
  const texto = textoSeguro(enlace, 500);
  return texto.startsWith(INICIO_MAPA) ? texto : "";
}

// Deja solo los números del WhatsApp (quita espacios, +, guiones)
export function numeroWhatsappSeguro(numero) {
  return textoSeguro(String(numero ?? ""), 20).replace(/\D/g, "");
}

// Pone una imagen. Si no existe o falla, muestra la imagen de respaldo.
export function ponerImagen(img, ruta, textoAlternativo = "") {
  img.src = rutaImagenSegura(ruta);
  img.alt = textoAlternativo;
  img.addEventListener(
    "error",
    () => {
      img.src = IMAGEN_RESPALDO;
    },
    { once: true },
  );
}
