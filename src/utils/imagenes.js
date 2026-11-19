// =========================================================
// imagenes.js · Prepara una foto antes de subirla
//
// - La achica (máximo ANCHO_MAXIMO_FOTO píxeles de ancho)
// - La convierte a WEBP (pesa mucho menos y carga rápido)
// - Al redibujarla se BORRAN los datos ocultos de la foto
//   (por ejemplo, la ubicación GPS del celular) → más privacidad
// =========================================================

import { ANCHO_MAXIMO_FOTO, MAXIMO_PIXELES_FOTO } from "./constantes";

// SEGURIDAD: ¿el archivo es de verdad una foto JPG, PNG o WEBP?
// Mira los primeros bytes (la "firma" del archivo), no el nombre:
// un archivo renombrado a .jpg no pasa.
export async function esImagenReal(archivo) {
  const b = new Uint8Array(await archivo.slice(0, 12).arrayBuffer());
  const jpg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((valor, i) => b[i] === valor);
  const texto = (desde, hasta) => String.fromCharCode(...b.slice(desde, hasta));
  const webp = texto(0, 4) === "RIFF" && texto(8, 12) === "WEBP";
  return jpg || png || webp;
}

// anchoMaximo: ANCHO_MAXIMO_FOTO para la foto normal, ANCHO_MINIATURA para la chica
export async function prepararFoto(archivo, anchoMaximo = ANCHO_MAXIMO_FOTO, calidad = 0.82) {
  const imagen = await createImageBitmap(archivo);
  if (imagen.width * imagen.height > MAXIMO_PIXELES_FOTO) {
    imagen.close();
    throw new Error("La foto es demasiado grande (en píxeles). Usa una foto normal del celular.");
  }
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
