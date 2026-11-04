// =========================================================
// reloj.js · Cuenta regresiva hasta el último día del mes
// =========================================================

const SEGUNDOS_POR_DIA = 86400;
const SEGUNDOS_POR_HORA = 3600;
const SEGUNDOS_POR_MINUTO = 60;

// Convierte 5 en "05"
const dosCifras = (numero) => String(numero).padStart(2, "0");

function actualizar() {
  const ahora = new Date();
  const finDeMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);
  const falta = Math.max(0, Math.floor((finDeMes - ahora) / 1000));

  document.getElementById("reloj-dias").textContent = dosCifras(
    Math.floor(falta / SEGUNDOS_POR_DIA),
  );
  document.getElementById("reloj-horas").textContent = dosCifras(
    Math.floor((falta % SEGUNDOS_POR_DIA) / SEGUNDOS_POR_HORA),
  );
  document.getElementById("reloj-minutos").textContent = dosCifras(
    Math.floor((falta % SEGUNDOS_POR_HORA) / SEGUNDOS_POR_MINUTO),
  );
  document.getElementById("reloj-segundos").textContent = dosCifras(
    falta % SEGUNDOS_POR_MINUTO,
  );
}

export function iniciarReloj() {
  actualizar();
  setInterval(actualizar, 1000); // se actualiza cada segundo
}
