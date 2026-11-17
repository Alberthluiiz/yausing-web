// =========================================================
// mantener-activo.mjs · Netlify Scheduled Function
//
// ¿Para qué? En el plan GRATIS, Supabase PAUSA la base de datos
// si pasan unos 7 días con poca actividad. Cuando está pausada
// la web no muestra productos ("la web no funciona").
//
// Esta función corre sola UNA vez al día en Netlify y hace una
// consulta pequeñita a Supabase (lee el nombre de la tienda).
// Con eso Supabase ve actividad y no se pausa.
//
// SEGURIDAD: usa solo la clave PÚBLICA (la misma de la web) y
// solo LEE un dato público. No cambia nada.
//
// Variables (las mismas de la web, en Netlify → Site configuration
// → Environment variables): VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
// Para ver si corrió: Netlify → Logs → Functions → mantener-activo
// =========================================================

export default async function mantenerActivo() {
  const base = Netlify.env.get("VITE_SUPABASE_URL");
  const clave = Netlify.env.get("VITE_SUPABASE_ANON_KEY");
  if (!base || !clave) {
    console.log("Faltan las variables de Supabase en Netlify");
    return new Response("Faltan variables", { status: 500 });
  }

  try {
    const respuesta = await fetch(`${base}/rest/v1/tienda?select=nombre&id=eq.1`, {
      headers: { apikey: clave, Authorization: `Bearer ${clave}` },
      signal: AbortSignal.timeout(10000),
    });
    console.log(`Supabase respondió: ${respuesta.status}`);
    return new Response("ok", { status: 200 });
  } catch (error) {
    console.log(`No se pudo llegar a Supabase: ${error.message}`);
    return new Response("error", { status: 502 });
  }
}

// Todos los días a las 12:00 (hora de Ecuador = 17:00 UTC)
export const config = {
  schedule: "0 17 * * *",
};
