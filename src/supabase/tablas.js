// =========================================================
// tablas.js · Funciones comunes para leer y guardar en una tabla
//
// SEGURIDAD (chequeo 6): solo se envían los campos permitidos
// de cada tabla ("campos"). Si llega algo extra, se descarta.
// =========================================================

import { supabase } from "./cliente";

// Copia solo los campos permitidos
function soloCampos(datos, campos) {
  return Object.fromEntries(campos.filter((c) => c in datos).map((c) => [c, datos[c]]));
}

// Crea un "ayudante" para una tabla: listar, crear, editar, borrar
export function crearTabla(nombreTabla, campos, orden = "orden") {
  return {
    async listar() {
      const { data, error } = await supabase.from(nombreTabla).select("*").order(orden, { ascending: true });
      if (error) throw error;
      return data;
    },
    async crear(datos) {
      const { data, error } = await supabase.from(nombreTabla).insert(soloCampos(datos, campos)).select().single();
      if (error) throw error;
      return data;
    },
    async editar(id, datos) {
      const { data, error } = await supabase
        .from(nombreTabla)
        .update(soloCampos(datos, campos))
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async borrar(id) {
      const { error } = await supabase.from(nombreTabla).delete().eq("id", id);
      if (error) throw error;
    },
  };
}
