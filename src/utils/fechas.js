// =========================================================
// fechas.js · Fechas de las ofertas
//
// En la base de datos, "termina_el" es un día: "2026-11-30".
// La oferta vale TODO ese día, hasta las 23:59:59 (hora del cliente).
// Si no tiene fecha, la oferta dura hasta fin de mes.
// =========================================================

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// "2026-11-30" → { anio: 2026, mes: 11, dia: 30 }  (o null si no es válida)
function leerDia(texto) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(texto ?? ""));
  if (!partes) return null;
  const [anio, mes, dia] = partes.slice(1).map(Number);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  return { anio, mes, dia };
}

// ¿El texto es un día válido? (para validar el formulario)
export const diaValido = (texto) => leerDia(texto) !== null;

// Momento exacto en que termina la oferta (el día siguiente a las 00:00)
export function finDeOferta(oferta, ahora = new Date()) {
  const dia = leerDia(oferta?.termina_el);
  if (dia) return new Date(dia.anio, dia.mes - 1, dia.dia + 1);
  return new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1); // fin de mes
}

// ¿La oferta todavía vale?
export const ofertaVigente = (oferta, ahora = new Date()) => finDeOferta(oferta, ahora) > ahora;

// "2026-11-30" → "30 de noviembre"
export function diaEnTexto(texto) {
  const dia = leerDia(texto);
  return dia ? `${dia.dia} de ${MESES[dia.mes - 1]}` : "";
}

// Fecha de hoy en formato "AAAA-MM-DD" (para el mínimo del calendario)
export function hoyEnTexto(ahora = new Date()) {
  const dos = (n) => String(n).padStart(2, "0");
  return `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`;
}
