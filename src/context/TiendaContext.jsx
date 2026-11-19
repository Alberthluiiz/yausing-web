// =========================================================
// TiendaContext.jsx · Datos de la tienda para la web pública
// (tienda, categorías, productos, ofertas y galería)
//
// Se cargan UNA vez al abrir la web y se comparten con todos
// los componentes:  const { datos, cargando, error } = useTienda();
//
// VELOCIDAD: los datos de la última visita se guardan en el
// navegador del cliente. La próxima vez la web aparece AL
// INSTANTE con esos datos y, en segundo plano, se piden los
// nuevos a Supabase (si algo cambió, se actualiza sola).
// Si el internet falla, se siguen viendo los guardados.
// =========================================================

import { createContext, useCallback, useEffect, useState } from "react";
import { cargarTodo } from "../supabase/consultas";
import { mensajeDeError } from "../utils/errores";

export const TiendaContext = createContext(null);

// Si cambias la forma de los datos, sube la versión (v2, v3...)
const CLAVE_GUARDADO = "yausig-datos-v1";
// Datos guardados más viejos que esto no se usan
const DIAS_MAXIMOS = 14;

function leerGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_GUARDADO));
    const edadDias = (Date.now() - guardado.fecha) / 86400000;
    return edadDias < DIAS_MAXIMOS && guardado.datos?.tienda ? guardado.datos : null;
  } catch {
    return null; // no hay nada guardado, o el navegador no deja guardar
  }
}

function guardar(datos) {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({ fecha: Date.now(), datos }));
  } catch {
    // modo incógnito o sin espacio: no pasa nada
  }
}

export function TiendaProvider({ children }) {
  const [datos, setDatos] = useState(leerGuardado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const nuevos = await cargarTodo();
      setDatos(nuevos);
      guardar(nuevos);
    } catch (e) {
      setError(mensajeDeError(e, "No pudimos cargar los productos. Revisa tu conexión y recarga la página."));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return <TiendaContext.Provider value={{ datos, cargando, error, recargar }}>{children}</TiendaContext.Provider>;
}
