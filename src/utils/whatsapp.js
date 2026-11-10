// =========================================================
// whatsapp.js · Arma los mensajes y enlaces de WhatsApp
//
// Aquí están TODOS los textos que llegan al WhatsApp de Mary.
// Si quieres cambiar cómo suena un mensaje, cámbialo aquí.
//
// *texto* = negrita en WhatsApp.
// NO usamos emojis: WhatsApp de computadora los convierte en "�"
// cuando llegan desde un enlace. Por eso usamos solo texto y "•".
// =========================================================

import { precioTexto } from "./formato";
import { diaEnTexto } from "./fechas";
import { soloNumeros, textoSeguro } from "./seguridad";

const LARGO_MAXIMO = 1500;

// Dirección de la web (en tu PC es localhost; publicada será tu dominio)
const sitioWeb = () => window.location.origin;

// ---------------------------------------------------------
// Enlace final. Se usa api.whatsapp.com (y no wa.me) porque
// wa.me redirige y en esa redirección se dañan las tildes y ñ.
// ---------------------------------------------------------
export function enlaceWhatsapp(numero, mensaje) {
  const limpio = soloNumeros(numero);
  if (!limpio) return "#contacto";
  const texto = encodeURIComponent(textoSeguro(mensaje, LARGO_MAXIMO));
  return `https://api.whatsapp.com/send?phone=${limpio}&text=${texto}`;
}

// ---------------------------------------------------------
// 1. Mensaje general (menú, botón flotante, portada)
// ---------------------------------------------------------
export function mensajeGeneral(nombreTienda) {
  return [
    `¡Hola, ${nombreTienda}!`,
    "Vi su página web y me encantaron sus prendas.",
    "¿Me pueden ayudar con información sobre modelos, tallas y precios, por favor? ¡Gracias!",
  ].join("\n");
}

// ---------------------------------------------------------
// 2. Un producto
//    eleccion = { talla, color, cantidad, precio }
//    (precio = el de la talla elegida; si no, el del producto)
// ---------------------------------------------------------
export function mensajePedidoProducto(nombreTienda, producto, eleccion = {}) {
  const precio = eleccion.precio ?? Number(producto.precio);
  const cantidad = eleccion.cantidad ?? 1;
  const lineas = [
    `¡Hola, ${nombreTienda}!`,
    "Vi este producto en su página web y me interesa:",
    "",
    `*${producto.nombre}*`,
    `• Precio: ${precioTexto(precio)}`,
  ];
  if (eleccion.talla) lineas.push(`• Talla: ${eleccion.talla}`);
  if (eleccion.color) lineas.push(`• Color: ${eleccion.color}`);
  if (cantidad > 1) {
    lineas.push(`• Cantidad: ${cantidad}`);
    lineas.push(`• Total: *${precioTexto(precio * cantidad)}*`);
  }
  lineas.push("", "Foto y detalles aquí:", `${sitioWeb()}/producto/${producto.id}`);
  lineas.push("", "¿Lo tienen disponible? ¿Cómo puedo hacer el pedido? ¡Gracias!");
  return lineas.join("\n");
}

// ---------------------------------------------------------
// 3. Una oferta
// ---------------------------------------------------------
export function mensajeOferta(nombreTienda, oferta) {
  const lineas = [
    `¡Hola, ${nombreTienda}!`,
    "Vi esta oferta en su página web y la quiero aprovechar:",
    "",
    `*${oferta.nombre}*`,
  ];
  if (oferta.descripcion) lineas.push(oferta.descripcion);
  lineas.push(`• Precio de oferta: *${precioTexto(oferta.precio_ahora)}* (antes ${precioTexto(oferta.precio_antes)})`);
  if (oferta.termina_el) lineas.push(`• Válida hasta el ${diaEnTexto(oferta.termina_el)}`);
  lineas.push("", `Ofertas: ${sitioWeb()}/#ofertas`);
  lineas.push("", "Me gustaría saber cómo hacer el pedido. ¡Gracias!");
  return lineas.join("\n");
}

// ---------------------------------------------------------
// 3b. Producto agotado: el cliente pide que le avisen
// ---------------------------------------------------------
export function mensajeAgotado(nombreTienda, producto, eleccion = {}) {
  const lineas = [
    `¡Hola, ${nombreTienda}!`,
    "Vi en su página web que esta prenda está agotada:",
    "",
    `*${producto.nombre}*`,
  ];
  if (eleccion.talla) lineas.push(`• Talla: ${eleccion.talla}`);
  if (eleccion.color) lineas.push(`• Color: ${eleccion.color}`);
  lineas.push("", `Foto y detalles aquí: ${sitioWeb()}/producto/${producto.id}`);
  lineas.push("", "¿Me pueden avisar cuando vuelva a llegar? ¡Gracias!");
  return lineas.join("\n");
}

// ---------------------------------------------------------
// 4. Mi pedido (varios productos de la bolsa)
//    items = [{ nombre, precio, talla, color, cantidad }]
// ---------------------------------------------------------
export function mensajePedido(nombreTienda, items) {
  const lineas = [`¡Hola, ${nombreTienda}!`, "Armé este pedido en su página web:", ""];
  let total = 0;
  items.forEach((item, indice) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const detalles = [item.talla && `talla ${item.talla}`, item.color && `color ${item.color}`].filter(Boolean).join(", ");
    lineas.push(`${indice + 1}. *${item.nombre}*${detalles ? ` (${detalles})` : ""}`);
    lineas.push(`    ${item.cantidad} x ${precioTexto(item.precio)} = ${precioTexto(subtotal)}`);
  });
  lineas.push("", `*Total: ${precioTexto(total)}*`);
  lineas.push("", "¿Me confirman si tienen todo disponible y cómo puedo pagar? ¡Gracias!");
  return lineas.join("\n");
}

// ---------------------------------------------------------
// 5. Quiero visitar el local (sección Contacto)
// ---------------------------------------------------------
export function mensajeVisita(nombreTienda, direccion) {
  return [`¡Hola, ${nombreTienda}!`, `Quiero visitarles en ${direccion}.`, "¿Hasta qué hora atienden hoy? ¡Gracias!"].join("\n");
}

// ---------------------------------------------------------
// 6. Una foto de la galería
// ---------------------------------------------------------
export function mensajeGaleria(nombreTienda, textoFoto) {
  return [
    `¡Hola, ${nombreTienda}!`,
    `Vi una foto en la galería de su página web${textoFoto ? ` ("${textoFoto}")` : ""} y me gustó mucho.`,
    "¿Me pueden dar más información y precios? ¡Gracias!",
  ].join("\n");
}
