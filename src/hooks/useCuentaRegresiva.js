// =========================================================
// useCuentaRegresiva.js · Tiempo que falta hasta una fecha
// (para el reloj de la sección Ofertas)
//
// Uso:  const { dias, horas, minutos, segundos } = useCuentaRegresiva(fecha);
// =========================================================

import { useEffect, useState } from "react";

function calcular(fin) {
  const falta = Math.max(0, Math.floor((fin - new Date()) / 1000));
  return {
    dias: Math.floor(falta / 86400),
    horas: Math.floor((falta % 86400) / 3600),
    minutos: Math.floor((falta % 3600) / 60),
    segundos: falta % 60,
  };
}

export function useCuentaRegresiva(fin) {
  const momento = fin.getTime(); // número: así el efecto no se repite en cada render
  const [tiempo, setTiempo] = useState(() => calcular(momento));
  useEffect(() => {
    setTiempo(calcular(momento));
    const id = setInterval(() => setTiempo(calcular(momento)), 1000);
    return () => clearInterval(id);
  }, [momento]);
  return tiempo;
}
