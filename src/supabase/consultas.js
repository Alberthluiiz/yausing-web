// =========================================================
// consultas.js · Todas las tablas de la tienda
//
// Para usar:  import { productos } from "../supabase/consultas";
//             const lista = await productos.listar();
// =========================================================

import { supabase } from "./cliente";
import { crearTabla } from "./tablas";

// Campos que el panel puede cambiar en cada tabla
export const productos = crearTabla("productos", [
  "nombre", "categoria_id", "descripcion", "precio", "foto_ruta",
  "tallas", "colores", "destacado", "agotado", "publicado", "orden",
]);

export const ofertas = crearTabla("ofertas", [
  "nombre", "descripcion", "precio_antes", "precio_ahora", "foto_ruta", "color", "termina_el", "publicado", "orden",
]);

export const galeria = crearTabla("galeria", ["foto_ruta", "texto", "tamano", "publicado", "orden"]);

export const categorias = crearTabla("categorias", ["nombre", "orden", "activa"]);

// ---------------------------------------------------------
// Tienda: es una sola fila (id = 1)
// ---------------------------------------------------------
const CAMPOS_TIENDA = [
  "nombre", "whatsapp", "telefono_visible", "direccion", "referencia", "horario",
  "mapa_url", "facebook", "instagram", "tiktok", "foto_portada_grande", "foto_portada_chica",
  "burbuja1_titulo", "burbuja1_texto", "burbuja2_titulo", "burbuja2_texto",
];

export const tienda = {
  async leer() {
    const { data, error } = await supabase.from("tienda").select("*").eq("id", 1).single();
    if (error) throw error;
    return data;
  },
  async editar(datos) {
    const limpio = Object.fromEntries(CAMPOS_TIENDA.filter((c) => c in datos).map((c) => [c, datos[c]]));
    const { data, error } = await supabase.from("tienda").update(limpio).eq("id", 1).select().single();
    if (error) throw error;
    return data;
  },
};

// ---------------------------------------------------------
// Todo lo que necesita la web pública, en una sola llamada
// (las 5 consultas van al mismo tiempo)
// ---------------------------------------------------------
export async function cargarTodo() {
  const [datosTienda, listaCategorias, listaProductos, listaOfertas, listaGaleria] = await Promise.all([
    tienda.leer(),
    categorias.listar(),
    productos.listar(),
    ofertas.listar(),
    galeria.listar(),
  ]);
  return {
    tienda: datosTienda,
    categorias: listaCategorias,
    productos: listaProductos,
    ofertas: listaOfertas,
    galeria: listaGaleria,
  };
}
