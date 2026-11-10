// =========================================================
// formato.js · Funciones para mostrar números y textos bonitos
// =========================================================

// 35 → "$35.00"
export function precioTexto(valor) {
  const numero = Number(valor) || 0;
  return `$${numero.toFixed(2)}`;
}

// 35 → { enteros: "35", centavos: "00" }  (para el precio grande)
export function partesPrecio(valor) {
  const [enteros, centavos] = (Number(valor) || 0).toFixed(2).split(".");
  return { enteros, centavos };
}

// Porcentaje de descuento: antes 120, ahora 110 → 8
export function porcentajeDescuento(antes, ahora) {
  const a = Number(antes);
  const b = Number(ahora);
  if (!a || b >= a) return 0;
  return Math.round(((a - b) / a) * 100);
}

// "Blusa Bordada!!" → "blusa-bordada"  (para nombres de archivo)
// Texto para buscar: sin tildes y en minúsculas ("Blusa Ñusta" → "blusa nusta")
export function paraBuscar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function aSlug(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
