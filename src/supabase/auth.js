// =========================================================
// auth.js · Iniciar y cerrar sesión (solo para el panel)
//
// SEGURIDAD (chequeo 2): las contraseñas las guarda Supabase Auth
// con hash (bcrypt). Nosotros nunca las vemos ni las guardamos.
// =========================================================

import { supabase } from "./cliente";

export async function iniciarSesion(correo, contrasena) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo.trim().toLowerCase(),
    password: contrasena,
  });
  if (error) throw error;
  return data.session;
}

export async function cerrarSesion() {
  await supabase.auth.signOut();
}

// ¿El usuario conectado está en la tabla "administradores"?
// (La tabla solo deja ver la fila propia, ver RLS.)
export async function esAdministrador(usuarioId) {
  if (!usuarioId) return false;
  const { data, error } = await supabase
    .from("administradores")
    .select("usuario_id")
    .eq("usuario_id", usuarioId)
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}
