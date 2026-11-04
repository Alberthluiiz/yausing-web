// =========================================================
// datos.js · Lee el archivo datos/tienda.json
// Es como una pequeña "API": la página le pide los datos
// y este archivo se los entrega.
// =========================================================

import { RUTA_DATOS } from "../config.js";

export async function cargarDatos() {
  // fetch() pide el archivo. "no-cache" = siempre trae la versión más nueva
  const respuesta = await fetch(RUTA_DATOS, { cache: "no-cache" });

  if (!respuesta.ok) {
    throw new Error(`No se pudo leer ${RUTA_DATOS} (error ${respuesta.status})`);
  }

  const datos = await respuesta.json();

  // Si falta alguna lista, ponemos una vacía para que la página no se rompa
  return {
    tienda: datos.tienda ?? {},
    imagenes: datos.imagenes ?? {},
    categorias: Array.isArray(datos.categorias) ? datos.categorias : ["Todos"],
    productos: Array.isArray(datos.productos) ? datos.productos : [],
    ofertas: Array.isArray(datos.ofertas) ? datos.ofertas : [],
    galeria: Array.isArray(datos.galeria) ? datos.galeria : [],
  };
}
