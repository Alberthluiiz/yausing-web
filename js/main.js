// =========================================================
// main.js · Archivo principal: arranca la página
//
// 1. Lee los datos de datos/tienda.json
// 2. Le pasa a cada sección sus datos
//
// Cada sección tiene su propio archivo en js/modulos/
// =========================================================

import { cargarDatos } from "./modulos/datos.js";
import {
  configurarWhatsapp,
  activarBotonesWhatsapp,
} from "./modulos/whatsapp.js";
import { iniciarProductos } from "./modulos/productos.js";
import { iniciarOfertas } from "./modulos/ofertas.js";
import { iniciarGaleria } from "./modulos/galeria.js";
import { iniciarContacto, iniciarImagenes } from "./modulos/contacto.js";
import { iniciarReloj } from "./modulos/reloj.js";
import { iniciarMenu } from "./modulos/menu.js";
import { iniciarAnimaciones } from "./modulos/animaciones.js";

async function iniciar() {
  // Esto funciona aunque el JSON falle
  iniciarMenu();
  iniciarReloj();
  document.getElementById("anio").textContent = new Date().getFullYear();

  try {
    const datos = await cargarDatos();

    configurarWhatsapp(datos.tienda.whatsapp);
    activarBotonesWhatsapp(datos.tienda.mensajeWhatsapp);
    iniciarImagenes(datos.imagenes);
    iniciarContacto(datos.tienda);
    iniciarProductos(datos.productos, datos.categorias);
    iniciarOfertas(datos.ofertas);
    iniciarGaleria(datos.galeria);
  } catch (error) {
    // Si algo falla, se ve un aviso y el detalle queda en la consola (F12)
    console.error("Error al cargar la página:", error);
    document.getElementById("aviso-error").hidden = false;
  } finally {
    // Las animaciones van al final, cuando ya existen todas las tarjetas
    iniciarAnimaciones();
  }
}

iniciar();
