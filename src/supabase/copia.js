// =========================================================
// copia.js · Copia de seguridad (solo desde el panel)
//
// El plan gratis de Supabase no guarda copias automáticas.
// Este botón descarga UN archivo .json con todo: datos de la
// tienda, categorías, productos (también los escondidos),
// ofertas, galería y la lista de fotos.
// Guárdalo en tu PC o en Google Drive una vez al mes.
// =========================================================

import { cargarTodo } from "./consultas";
import { listarFotos } from "./fotos";

export async function descargarCopia() {
  // Desde el panel, cargarTodo() trae también lo escondido (reglas RLS del admin)
  const [datos, listaFotos] = await Promise.all([cargarTodo(), listarFotos()]);

  const copia = {
    hecha_el: new Date().toISOString(),
    ...datos, // tienda, categorias, productos, ofertas, galeria
    fotos: listaFotos.map((foto) => foto.ruta),
  };

  // Crea el archivo en el navegador y lo descarga
  const archivo = new Blob([JSON.stringify(copia, null, 2)], { type: "application/json" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = `copia-yausig-${copia.hecha_el.slice(0, 10)}.json`;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  return datos.productos.length;
}
