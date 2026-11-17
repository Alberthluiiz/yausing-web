// =========================================================
// imagenes.js · Prepara una foto antes de subirla
//
// - La achica (máximo ANCHO_MAXIMO_FOTO píxeles de ancho)
// - La convierte a WEBP (pesa mucho menos y carga rápido)
// - Al redibujarla se BORRAN los datos ocultos de la foto
//   (por ejemplo, la ubicación GPS del celular) → más privacidad
// =========================================================

import { ANCHO_MAXIMO_FOTO } from "./constantes";

// anchoMaximo: ANCHO_MAXIMO_FOTO para la foto normal, ANCHO_MINIATURA para la chica
export async function prepararFoto(archivo, anchoMaximo = ANCHO_MAXIMO_FOTO, calidad = 0.82) {
  const imagen = await createImageBitmap(archivo);
  const escala = Math.min(1, anchoMaximo / imagen.width);
  const ancho = Math.round(imagen.width * escala);
  const alto = Math.round(imagen.height * escala);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  lienzo.getContext("2d").drawImage(imagen, 0, 0, ancho, alto);
  imagen.close();

  const blob = await new Promise((resolver) => lienzo.toBlob(resolver, "image/webp", calidad));
  // Si el navegador no sabe crear WEBP, se sube la foto original
  return blob && blob.type === "image/webp" ? blob : archivo;
}
