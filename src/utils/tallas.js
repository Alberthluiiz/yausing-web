// =========================================================
// tallas.js · Tallas y su precio
//
// En la base de datos cada talla se guarda como texto:
//   - Talla con el precio normal del producto:  "S"
//   - Talla con OTRO precio:                    "XL:20"  (talla + precio)
// El "precio" del producto es el precio base.
// =========================================================

// "XL:20" → { nombre: "XL", precio: 20 }      "S" → { nombre: "S", precio: null }
export function leerTalla(valor) {
  const [nombreCrudo, precioCrudo] = String(valor ?? "").split(":");
  const nombre = nombreCrudo.trim().slice(0, 15);
  const precio = Number(precioCrudo);
  return { nombre, precio: precioCrudo !== undefined && Number.isFinite(precio) && precio >= 0 ? precio : null };
}

// { nombre, precio } → texto para guardar
export function guardarTalla({ nombre, precio }) {
  const limpio = String(nombre ?? "").replace(/[:,]/g, "").trim().slice(0, 15);
  const numero = Number(precio);
  return precio === "" || precio === null || precio === undefined || !Number.isFinite(numero)
    ? limpio
    : `${limpio}:${Math.round(numero * 100) / 100}`;
}

// Precio de una talla (si no tiene precio propio, el del producto)
export function precioDeTalla(producto, nombreTalla) {
  const talla = producto.tallas.map(leerTalla).find((t) => t.nombre === nombreTalla);
  return talla?.precio ?? Number(producto.precio);
}

// El precio más bajo del producto (para "Desde $...")
export function precioDesde(producto) {
  const precios = [Number(producto.precio)];
  producto.tallas.map(leerTalla).forEach((t) => t.precio !== null && precios.push(t.precio));
  // Si TODAS las tallas tienen precio propio, el precio base no cuenta
  const todasConPrecio = producto.tallas.length > 0 && producto.tallas.every((v) => leerTalla(v).precio !== null);
  return Math.min(...(todasConPrecio ? precios.slice(1) : precios));
}

// ¿El precio cambia según la talla?
export function precioVariable(producto) {
  const base = Number(producto.precio);
  return producto.tallas.some((v) => {
    const { precio } = leerTalla(v);
    return precio !== null && precio !== base;
  });
}
