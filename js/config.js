// =========================================================
// config.js · Variables generales de la página
// Aquí van los valores que usan varios archivos.
// (Los productos, fotos y datos de la tienda están en datos/tienda.json)
// =========================================================

// Ruta del archivo con todos los datos de la tienda
export const RUTA_DATOS = "datos/tienda.json";

// Carpeta donde deben estar TODAS las imágenes (por seguridad solo se aceptan de aquí)
export const CARPETA_IMAGENES = "img/";

// Imagen que se muestra si una foto no existe o está mal escrita
export const IMAGEN_RESPALDO = "img/yausig-icono.svg";

// El mapa solo puede venir de Google Maps
export const INICIO_MAPA = "https://www.google.com/maps";

// Colores permitidos para las ofertas (son las variables de css/variables.css)
export const COLORES_OFERTA = ["rojo", "naranja", "amarillo", "verde", "azul"];

// Tamaños permitidos para las fotos de la galería
export const TAMANOS_GALERIA = ["normal", "grande", "ancha"];

// Cuántos píxeles hay que bajar para que el menú se achique
export const ALTURA_MENU_ACHICADO = 40;
