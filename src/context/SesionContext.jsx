// =========================================================
// SesionContext.jsx · Guarda quién inició sesión
//
// Cualquier componente puede saber si Mary está conectada con:
//   const { usuario, esAdmin, cargando } = useSesion();
// =========================================================

import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/cliente";
import { esAdministrador } from "../supabase/auth";

export const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    // Revisa el usuario y si es administrador
    async function revisar(sesion) {
      const usuarioActual = sesion?.user ?? null;
      const admin = usuarioActual ? await esAdministrador(usuarioActual.id) : false;
      if (!activo) return;
      setUsuario(usuarioActual);
      setEsAdmin(admin);
      setCargando(false);
    }

    // 1. Al abrir la web
    supabase.auth.getSession().then(({ data }) => revisar(data.session));

    // 2. Cada vez que inicia o cierra sesión.
    //    (setTimeout evita llamar a Supabase dentro del aviso, como pide su guía)
    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setTimeout(() => revisar(sesion), 0);
    });

    return () => {
      activo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return <SesionContext.Provider value={{ usuario, esAdmin, cargando }}>{children}</SesionContext.Provider>;
}
