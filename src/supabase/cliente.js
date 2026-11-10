// =========================================================
// cliente.js · Conexión con Supabase
//
// SEGURIDAD (chequeo 1): la dirección y la clave se leen del
// archivo .env (que NO se sube a GitHub). En Netlify se ponen en
// Site configuration → Environment variables.
//
// La clave "anon" es PÚBLICA a propósito: cualquiera puede verla
// en el navegador. Lo que protege los datos son las reglas RLS de
// la base de datos (ver supabase/sql/01-tablas-y-seguridad.sql).
// =========================================================

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const clavePublica = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !clavePublica) {
  throw new Error("Falta el archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (mira .env.example).");
}

export const supabase = createClient(url, clavePublica, {
  auth: {
    // SEGURIDAD (chequeo 10): la sesión se guarda en sessionStorage,
    // así se BORRA al cerrar el navegador (útil si Mary usa una
    // computadora compartida). El token dura 1 hora y se renueva solo.
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
