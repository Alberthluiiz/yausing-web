// =========================================================
// auth.js · Iniciar y cerrar sesión (solo para el panel)
//
// SEGURIDAD (chequeo 2): las contraseñas las guarda Supabase Auth
// con hash (bcrypt). Nosotros nunca las vemos ni las guardamos.
// Abajo está también la verificación en dos pasos (código del celular).
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

// La sesión guardada al abrir la web (o null si no hay)
export async function leerSesion() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Avisa cada vez que inicia o cierra sesión (o confirma el código).
// Devuelve una función para dejar de escuchar.
export function escucharCambiosDeSesion(alCambiar) {
  const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => alCambiar(sesion));
  return () => data.subscription.unsubscribe();
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

// ---------------------------------------------------------
// VERIFICACIÓN EN DOS PASOS (código de 6 números del celular)
// SEGURIDAD (chequeo 3): aunque alguien adivine la contraseña,
// sin el celular no entra. La base de datos también lo exige
// (ver supabase/sql/09-endurecer-seguridad.sql).
// Se usa con una app como Google Authenticator o Microsoft Authenticator.
// ---------------------------------------------------------

// ¿Falta escribir el código? (tiene el código activado pero
// esta sesión entró solo con la contraseña)
export async function faltaCodigo() {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) return false;
  return data.nextLevel === "aal2" && data.currentLevel !== "aal2";
}

// El código activado (o null si no tiene)
export async function codigoActivado() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data.totp.find((factor) => factor.status === "verified") ?? null;
}

// Revisa el código de 6 números al entrar
export async function verificarCodigo(codigo) {
  const factor = await codigoActivado();
  if (!factor) throw new Error("No tienes el código activado.");
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: codigo });
  if (error) throw error;
}

// Paso 1 para activar: crea el código y devuelve el dibujo QR
// para escanear con el celular (y la clave por si no puede escanear)
export async function empezarActivacion() {
  // Borra intentos anteriores que quedaron a medias
  const { data: lista } = await supabase.auth.mfa.listFactors();
  for (const factor of lista?.all ?? []) {
    if (factor.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: factor.id });
  }
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: `Celular ${new Date().toISOString().slice(0, 10)}`,
  });
  if (error) throw error;
  return { factorId: data.id, qr: data.totp.qr_code, clave: data.totp.secret };
}

// Paso 2 para activar: confirma con el primer código que muestra el celular
export async function terminarActivacion(factorId, codigo) {
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: codigo });
  if (error) throw error;
}

// Desactiva el código (solo se puede si entró CON el código)
export async function desactivarCodigo(factorId) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw error;
  await supabase.auth.refreshSession();
}
