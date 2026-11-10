// =========================================================
// fotos.js · Subir, listar y borrar fotos del depósito "fotos"
// =========================================================

import { supabase } from "./cliente";
import { DEPOSITO_FOTOS, CARPETA_FOTOS } from "../utils/constantes";
import { aSlug } from "../utils/formato";
import { prepararFoto } from "../utils/imagenes";
import { rutaFotoValida } from "../utils/seguridad";
import { validarArchivoFoto } from "../utils/validar";

const deposito = () => supabase.storage.from(DEPOSITO_FOTOS);

// Dirección pública de una foto (para mostrarla en la web)
export function urlFoto(ruta) {
  if (!rutaFotoValida(ruta)) return "";
  return deposito().getPublicUrl(ruta).data.publicUrl;
}

// Sube UNA foto nueva (achicada y en WEBP). Devuelve su ruta.
// "nombreBase" sirve para que el archivo tenga un nombre entendible.
export async function subirFoto(archivo, nombreBase = "foto") {
  const problema = validarArchivoFoto(archivo);
  if (problema) throw new Error(problema);

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
  return ruta;
}

// Sube una foto SIN cambiarle el nombre (para pasar las fotos que ya tenías).
// Ej: "23-saco-celeste-bordado.png" → productos/23-saco-celeste-bordado.png
export async function subirFotoConSuNombre(archivo) {
  const problema = validarArchivoFoto(archivo);
  if (problema) throw new Error(problema);

  const [nombre, ...resto] = archivo.name.toLowerCase().split(".");
  const extension = resto.pop();
  const ruta = `${CARPETA_FOTOS}/${aSlug(nombre)}.${extension}`;

  const { error } = await deposito().upload(ruta, archivo, {
    contentType: archivo.type,
    cacheControl: "3600",
    upsert: true, // si ya existe, la reemplaza
  });
  if (error) throw error;
  return ruta;
}

// Lista todas las fotos de la carpeta
export async function listarFotos() {
  const { data, error } = await deposito().list(CARPETA_FOTOS, {
    limit: 500,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw error;
  return data
    .filter((archivo) => archivo.id) // quita carpetas
    .map((archivo) => ({
      nombre: archivo.name,
      ruta: `${CARPETA_FOTOS}/${archivo.name}`,
      pesoKb: Math.round((archivo.metadata?.size ?? 0) / 1024),
    }));
}

// Borra una foto del depósito
export async function borrarFoto(ruta) {
  if (!rutaFotoValida(ruta)) return;
  const { error } = await deposito().remove([ruta]);
  if (error) throw error;
}
