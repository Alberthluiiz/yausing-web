// =========================================================
// colores.js · Colores de las prendas (los circulitos)
//
// En la base de datos cada color se guarda como texto:
//   - Un color de la PALETA:  "Azul"
//   - Un color propio:        "Vino:#7b1e2b"   (nombre + código)
// Si quieres agregar un color a la paleta, agrégalo aquí abajo.
// =========================================================

export const PALETA = [
  { nombre: "Blanco", hex: "#ffffff" },
  { nombre: "Hueso", hex: "#efe6d6" },
  { nombre: "Beige", hex: "#c8a27a" },
  { nombre: "Café", hex: "#6b4a35" },
  { nombre: "Negro", hex: "#1b1b1b" },
  { nombre: "Gris", hex: "#8a8d93" },
  { nombre: "Rojo", hex: "#c0201c" },
  { nombre: "Vino", hex: "#7b1e2b" },
  { nombre: "Rosado", hex: "#f2a7c3" },
  { nombre: "Fucsia", hex: "#d6247a" },
  { nombre: "Naranja", hex: "#e8731a" },
  { nombre: "Amarillo", hex: "#f5c518" },
  { nombre: "Mostaza", hex: "#c99a1d" },
  { nombre: "Verde", hex: "#2e8b57" },
  { nombre: "Verde agua", hex: "#3fb5b9" },
  { nombre: "Celeste", hex: "#7cc3ea" },
  { nombre: "Azul", hex: "#1f4fa3" },
  { nombre: "Azul marino", hex: "#1e2040" },
  { nombre: "Morado", hex: "#6a2c91" },
  { nombre: "Lila", hex: "#b79ad8" },
  { nombre: "Dorado", hex: "#d4af37" },
  { nombre: "Plateado", hex: "#c0c0c0" },
];

const HEX_VALIDO = /^#[0-9a-f]{6}$/i;
const normalizar = (texto) =>
  String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

// "Vino:#7b1e2b" → { nombre: "Vino", hex: "#7b1e2b" }
// "Azul"         → { nombre: "Azul", hex: "#1f4fa3" }  (de la paleta)
// "etc."         → { nombre: "etc.", hex: "" }          (sin círculo, se muestra el texto)
export function leerColor(valor) {
  const [nombreCrudo, hexCrudo] = String(valor ?? "").split(":");
  const nombre = nombreCrudo.trim().slice(0, 20);
  if (HEX_VALIDO.test(hexCrudo ?? "")) return { nombre, hex: hexCrudo.toLowerCase() };
  const dePaleta = PALETA.find((color) => normalizar(color.nombre) === normalizar(nombre));
  return { nombre, hex: dePaleta?.hex ?? "" };
}

// { nombre, hex } → texto para guardar
export function guardarColor({ nombre, hex }) {
  const limpio = String(nombre ?? "").replace(/[:,]/g, "").trim().slice(0, 20);
  const dePaleta = PALETA.find((color) => normalizar(color.nombre) === normalizar(limpio) && color.hex === hex);
  return dePaleta || !HEX_VALIDO.test(hex ?? "") ? limpio : `${limpio}:${hex.toLowerCase()}`;
}

// ¿El color es muy claro? (para ponerle un borde gris y que se vea en fondo blanco)
export function esClaro(hex) {
  if (!HEX_VALIDO.test(hex)) return false;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 215;
}
