// =========================================================
// useLimiteIntentos.js · Límite de intentos en el login (chequeo 3)
//
// Después de INTENTOS_LOGIN errores seguidos, el botón se bloquea
// MINUTOS_BLOQUEO minutos. Esto es una ayuda en el navegador;
// la protección fuerte la pone Supabase Auth en su servidor
// (limita los intentos por dirección IP).
// =========================================================

import { useCallback, useEffect, useState } from "react";
import { INTENTOS_LOGIN, MINUTOS_BLOQUEO } from "../utils/constantes";

const CLAVE = "yausig-intentos-login";

function leer() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? { fallos: 0, hasta: 0 };
  } catch {
    return { fallos: 0, hasta: 0 };
  }
}
function guardar(estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* si el navegador no deja guardar, no pasa nada */
  }
}

export function useLimiteIntentos() {
  const [estado, setEstado] = useState(leer);
  const [ahora, setAhora] = useState(Date.now());

  // Actualiza el reloj cada segundo mientras está bloqueado
  useEffect(() => {
    if (estado.hasta <= Date.now()) return;
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, [estado.hasta]);

  const segundosRestantes = Math.max(0, Math.ceil((estado.hasta - ahora) / 1000));
  const bloqueado = segundosRestantes > 0;

  const registrarFallo = useCallback(() => {
    setEstado((anterior) => {
      const fallos = anterior.fallos + 1;
      const nuevo =
        fallos >= INTENTOS_LOGIN
          ? { fallos: 0, hasta: Date.now() + MINUTOS_BLOQUEO * 60 * 1000 }
          : { fallos, hasta: 0 };
      guardar(nuevo);
      setAhora(Date.now());
      return nuevo;
    });
  }, []);

  const reiniciar = useCallback(() => {
    const nuevo = { fallos: 0, hasta: 0 };
    guardar(nuevo);
    setEstado(nuevo);
  }, []);

  return { bloqueado, segundosRestantes, intentosQuedan: INTENTOS_LOGIN - estado.fallos, registrarFallo, reiniciar };
}
