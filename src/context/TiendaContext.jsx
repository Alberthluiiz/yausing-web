// =========================================================
// TiendaContext.jsx · Datos de la tienda para la web pública
// (tienda, categorías, productos, ofertas y galería)
//
// Se cargan UNA vez al abrir la web y se comparten con todos
// los componentes:  const { datos, cargando, error } = useTienda();
// =========================================================

import { createContext, useCallback, useEffect, useState } from "react";
import { cargarTodo } from "../supabase/consultas";
import { mensajeDeError } from "../utils/errores";

export const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setDatos(await cargarTodo());
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
