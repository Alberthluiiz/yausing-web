// =========================================================
// validar.js · Revisa los formularios del panel ANTES de guardar
//
// Cada función devuelve un objeto con los errores encontrados.
// Si el objeto está vacío ({}), todo está bien.
// (La base de datos también revisa todo otra vez, por si acaso.)
// =========================================================

import { COLORES_OFERTA, TAMANOS_GALERIA, TIPOS_FOTO, MAXIMO_MB_FOTO } from "./constantes";
import { enlaceSeguro, mapaSeguro, soloNumeros } from "./seguridad";
import { diaValido } from "./fechas";

// --- Ayudantes pequeños ---
const largoEntre = (texto, min, max) => {
  const largo = String(texto ?? "").trim().length;
  return largo >= min && largo <= max;
};
const precioValido = (valor) => {
  const numero = Number(valor);
  return valor !== "" && Number.isFinite(numero) && numero >= 0 && numero <= 10000;
};

export function validarProducto(datos) {
  const errores = {};
  if (!largoEntre(datos.nombre, 2, 80)) errores.nombre = "Escribe un nombre de 2 a 80 letras.";
  if (!precioValido(datos.precio)) errores.precio = "Escribe un precio válido (ej: 25 o 25.50).";
  if (String(datos.descripcion ?? "").length > 300) errores.descripcion = "Máximo 300 letras.";
  if (!datos.categoria_id) errores.categoria_id = "Elige una categoría.";
  const tallaMala = (datos.tallas ?? []).some((t) => {
    const [, precio] = String(t).split(":");
    return precio !== undefined && !precioValido(precio);
  });
  if (tallaMala) errores.tallas = "Algún precio de talla no es válido.";
  return errores;
}

export function validarOferta(datos) {
  const errores = {};
  if (!largoEntre(datos.nombre, 2, 80)) errores.nombre = "Escribe un nombre de 2 a 80 letras.";
  if (!precioValido(datos.precio_antes)) errores.precio_antes = "Precio de antes no válido.";
  if (!precioValido(datos.precio_ahora)) errores.precio_ahora = "Precio de ahora no válido.";
  if (!errores.precio_antes && !errores.precio_ahora && Number(datos.precio_ahora) > Number(datos.precio_antes)) {
    errores.precio_ahora = "El precio de ahora debe ser menor o igual al de antes.";
  }
  if (String(datos.descripcion ?? "").length > 300) errores.descripcion = "Máximo 300 letras.";
  if (!COLORES_OFERTA.includes(datos.color)) errores.color = "Elige un color de la lista.";
  if (datos.termina_el && !diaValido(datos.termina_el)) errores.termina_el = "Elige un día del calendario.";
  return errores;
}

export function validarFotoGaleria(datos) {
  const errores = {};
  if (!datos.foto_ruta) errores.foto_ruta = "Sube una foto.";
  if (String(datos.texto ?? "").length > 80) errores.texto = "Máximo 80 letras.";
  if (!TAMANOS_GALERIA.includes(datos.tamano)) errores.tamano = "Elige un tamaño de la lista.";
  return errores;
}

export function validarCategoria(datos) {
  const errores = {};
  if (!largoEntre(datos.nombre, 2, 40)) errores.nombre = "Escribe un nombre de 2 a 40 letras.";
  return errores;
}

export function validarTienda(datos) {
  const errores = {};
  if (!largoEntre(datos.nombre, 2, 80)) errores.nombre = "Escribe el nombre de la tienda.";
  if (!/^593\d{9}$/.test(soloNumeros(datos.whatsapp))) {
    errores.whatsapp = "Escribe el número con 593 al inicio y sin el 0. Ej: 593961380728";
  }
  if (!largoEntre(datos.telefono_visible, 1, 30)) errores.telefono_visible = "Escribe el teléfono que se verá.";
  if (!largoEntre(datos.direccion, 3, 150)) errores.direccion = "Escribe la dirección.";
  if (datos.mapa_url && !mapaSeguro(datos.mapa_url)) {
    errores.mapa_url = "El mapa debe empezar con https://www.google.com/maps";
  }
  for (const campo of ["burbuja1_titulo", "burbuja1_texto", "burbuja2_titulo", "burbuja2_texto"]) {
    if (!largoEntre(datos[campo], 1, 40)) errores[campo] = "Escribe de 1 a 40 letras.";
  }
  for (const red of ["facebook", "instagram", "tiktok"]) {
    if (datos[red] && !enlaceSeguro(datos[red])) errores[red] = "El enlace debe empezar con https://";
  }
  return errores;
}

// Revisa un archivo de foto antes de subirlo
export function validarArchivoFoto(archivo) {
  if (!archivo) return "No elegiste ninguna foto.";
  if (!TIPOS_FOTO.includes(archivo.type)) return "Solo se aceptan fotos JPG, PNG o WEBP.";
  if (archivo.size > MAXIMO_MB_FOTO * 1024 * 1024) return `La foto pesa más de ${MAXIMO_MB_FOTO} MB.`;
  return "";
}

// Correo con forma válida (para el login)
export function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(correo ?? "").trim()) && String(correo).length <= 254;
}
