// =========================================================
// fotos.js · Subir, listar y borrar fotos del depósito "fotos"
//
// Cada foto tiene DOS versiones:
//   productos/saco.webp   → grande (detalle del producto)
//   miniaturas/saco.webp  → chica, 600 px (tarjetas y galería)
// La miniatura se crea sola al subir. Para las fotos antiguas,
// en el panel → Fotos → "Crear miniaturas que faltan".
// =========================================================

import { supabase } from "./cliente";
import { DEPOSITO_FOTOS, CARPETA_FOTOS, CARPETA_MINIATURAS, ANCHO_MINIATURA } from "../utils/constantes";
import { aSlug } from "../utils/formato";
import { esImagenReal, prepararFoto } from "../utils/imagenes";
import { rutaFotoValida } from "../utils/seguridad";
import { validarArchivoFoto } from "../utils/validar";
import { ErrorParaMostrar } from "../utils/errores";

// SEGURIDAD: antes de subir, revisa tipo, extensión, peso (5 MB)
// y que el archivo sea una imagen de verdad. (El depósito de
// Supabase también rechaza lo que no sea JPG/PNG/WEBP de 5 MB o menos.)
async function revisarFoto(archivo) {
  const problema = validarArchivoFoto(archivo);
  if (problema) throw new ErrorParaMostrar(problema);
  if (!(await esImagenReal(archivo))) throw new ErrorParaMostrar("La foto no es una imagen JPG, PNG o WEBP de verdad.");
}

const deposito = () => supabase.storage.from(DEPOSITO_FOTOS);

// Dirección pública de una foto (para mostrarla en la web)
export function urlFoto(ruta) {
  if (!rutaFotoValida(ruta)) return "";
  return deposito().getPublicUrl(ruta).data.publicUrl;
}

// Ruta de la miniatura de una foto: productos/saco.webp → miniaturas/saco.webp
function rutaMiniatura(ruta) {
  if (!rutaFotoValida(ruta)) return "";
  const nombre = ruta.split("/").pop().replace(/\.[a-z0-9]+$/, ".webp");
  return `${CARPETA_MINIATURAS}/${nombre}`;
}

// Dirección pública de la miniatura
export function urlMiniatura(ruta) {
  const mini = rutaMiniatura(ruta);
  return mini ? deposito().getPublicUrl(mini).data.publicUrl : "";
}

// Crea y sube la miniatura de una foto (archivo o blob).
// Si falla, no pasa nada: la web usa la foto grande.
async function subirMiniatura(archivo, ruta) {
  try {
    const chica = await prepararFoto(archivo, ANCHO_MINIATURA, 0.78);
    if (chica.type !== "image/webp") return false;
    const { error } = await deposito().upload(rutaMiniatura(ruta), chica, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: true,
    });
    return !error;
  } catch {
    return false;
  }
}

// Sube UNA foto nueva (achicada y en WEBP). Devuelve su ruta.
// "nombreBase" sirve para que el archivo tenga un nombre entendible.
export async function subirFoto(archivo, nombreBase = "foto") {
  await revisarFoto(archivo);

  const fotoLista = await prepararFoto(archivo);
  const extension = fotoLista.type === "image/webp" ? "webp" : archivo.name.split(".").pop().toLowerCase();
  // Fecha al inicio = nombre único (nunca se pisa otra foto)
  const ruta = `${CARPETA_FOTOS}/${Date.now()}-${aSlug(nombreBase) || "foto"}.${extension}`;

  const { error } = await deposito().upload(ruta, fotoLista, {
    contentType: fotoLista.type || archivo.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  await subirMiniatura(archivo, ruta);
  return ruta;
}

// Sube una foto SIN cambiarle el nombre (para pasar las fotos que ya tenías).
// Ej: "23-saco-celeste-bordado.png" → productos/23-saco-celeste-bordado.webp
// También se achica y pasa a WEBP: así se borran los datos ocultos
// del celular (ubicación GPS, modelo...) igual que en subirFoto.
export async function subirFotoConSuNombre(archivo) {
  await revisarFoto(archivo);

  const nombreCompleto = archivo.name.toLowerCase();
  const nombre = nombreCompleto.slice(0, nombreCompleto.lastIndexOf(".")); // "a.b.png" → "a.b"
  const fotoLista = await prepararFoto(archivo);
  const extension = fotoLista.type === "image/webp" ? "webp" : nombreCompleto.split(".").pop();
  const ruta = `${CARPETA_FOTOS}/${aSlug(nombre) || `foto-${Date.now()}`}.${extension}`;

  const { error } = await deposito().upload(ruta, fotoLista, {
    contentType: fotoLista.type || archivo.type,
    cacheControl: "3600",
    upsert: true, // si ya existe, la reemplaza
  });
  if (error) throw error;
  await subirMiniatura(archivo, ruta);
  return ruta;
}

// Lista todas las fotos de una carpeta (por defecto, las grandes)
export async function listarFotos(carpeta = CARPETA_FOTOS) {
  const { data, error } = await deposito().list(carpeta, {
    limit: 500,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw error;
  return data
    .filter((archivo) => archivo.id) // quita carpetas
    .map((archivo) => ({
      nombre: archivo.name,
      ruta: `${carpeta}/${archivo.name}`,
      pesoKb: Math.round((archivo.metadata?.size ?? 0) / 1024),
    }));
}

// Borra una foto del depósito (y su miniatura)
export async function borrarFoto(ruta) {
  if (!rutaFotoValida(ruta)) return;
  const { error } = await deposito().remove([ruta, rutaMiniatura(ruta)]);
  if (error) throw error;
}

// Crea las miniaturas de las fotos que todavía no tienen.
// alAvanzar({ hechas, total }) sirve para mostrar el progreso.
// Devuelve cuántas se crearon y cuántas fallaron.
export async function crearMiniaturasQueFaltan(alAvanzar = () => {}) {
  const [grandes, chicas] = await Promise.all([listarFotos(CARPETA_FOTOS), listarFotos(CARPETA_MINIATURAS)]);
  const yaHay = new Set(chicas.map((foto) => foto.ruta));
  const faltan = grandes.filter((foto) => !yaHay.has(rutaMiniatura(foto.ruta)));

  let creadas = 0;
  let fallidas = 0;
  alAvanzar({ hechas: 0, total: faltan.length });
  // Una por una, para no saturar la conexión
  for (const [indice, foto] of faltan.entries()) {
    try {
      const respuesta = await fetch(urlFoto(foto.ruta));
      if (!respuesta.ok) throw new Error("No se pudo bajar la foto");
      if (await subirMiniatura(await respuesta.blob(), foto.ruta)) creadas += 1;
      else fallidas += 1;
    } catch {
      fallidas += 1;
    }
    alAvanzar({ hechas: indice + 1, total: faltan.length });
  }
  return { creadas, fallidas, total: faltan.length };
}
