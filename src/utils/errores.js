// =========================================================
// errores.js · Convierte los errores técnicos en mensajes simples
//
// SEGURIDAD (chequeo 11): al visitante y a Mary nunca les
// mostramos detalles internos (nombres de tablas, códigos SQL...).
// El detalle técnico solo se ve en la consola mientras programas
// (npm run dev), nunca en la web publicada.
// =========================================================

export function mensajeDeError(error, mensajePorDefecto = "Algo salió mal. Inténtalo otra vez en un momento.") {
  // Solo en tu PC (modo desarrollo) mostramos el detalle en la consola
  if (import.meta.env.DEV) console.error("[detalle del error]", error);

  const texto = String(error?.message ?? "").toLowerCase();
  const codigo = error?.code ?? error?.status;

  if (texto.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (texto.includes("email not confirmed")) return "Esta cuenta aún no está confirmada.";
  if (codigo === 429 || texto.includes("rate limit") || texto.includes("too many")) {
    return "Demasiados intentos. Espera unos minutos y vuelve a probar.";
  }
  if (texto.includes("failed to fetch") || texto.includes("network")) {
    return "No hay conexión a internet. Revisa tu conexión e inténtalo otra vez.";
  }
  if (codigo === "42501" || texto.includes("row-level security") || texto.includes("permission")) {
    return "No tienes permiso para hacer esto. Vuelve a iniciar sesión.";
  }
  if (codigo === "23505") return "Ya existe uno con ese nombre.";
  if (codigo === "23514") return "Algún dato no es válido. Revisa el formulario.";
  if (texto.includes("payload too large") || texto.includes("maximum allowed size")) {
    return "La foto es demasiado pesada.";
  }
  return mensajePorDefecto;
}
