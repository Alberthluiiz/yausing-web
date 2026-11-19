// =========================================================
// SesionContext.jsx · Guarda quién inició sesión
//
// Cualquier componente puede saber si Mary está conectada con:
//   const { usuario, esAdmin, pideCodigo, cargando } = useSesion();
// (pideCodigo = entró con la contraseña pero falta el código del celular)
// =========================================================

import { createContext, useEffect, useState } from "react";
import { esAdministrador, escucharCambiosDeSesion, faltaCodigo, leerSesion } from "../supabase/auth";

export const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [pideCodigo, setPideCodigo] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    // Revisa el usuario, si es administrador y si le falta el código
    // del celular. Sin el código, NO cuenta como administradora
    // (la base de datos tampoco la deja editar).
    async function revisar(sesion) {
      const usuarioActual = sesion?.user ?? null;
      const admin = usuarioActual ? await esAdministrador(usuarioActual.id) : false;
      const falta = admin ? await faltaCodigo() : false;
      if (!activo) return;
      setUsuario(usuarioActual);
      setEsAdmin(admin && !falta);
      setPideCodigo(falta);
      setCargando(false);
    }

    // 1. Al abrir la web
    leerSesion().then(revisar);

    // 2. Cada vez que inicia o cierra sesión.
    //    (setTimeout evita llamar a Supabase dentro del aviso, como pide su guía)
    const dejarDeEscuchar = escucharCambiosDeSesion((sesion) => {
      setTimeout(() => revisar(sesion), 0);
    });

    return () => {
      activo = false;
      dejarDeEscuchar();
    };
  }, []);

  return <SesionContext.Provider value={{ usuario, esAdmin, pideCodigo, cargando }}>{children}</SesionContext.Provider>;
}
