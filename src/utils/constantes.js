// =========================================================
// constantes.js · Valores fijos que usa toda la web
// Si quieres cambiar un límite o una opción, hazlo aquí.
// =========================================================

// Nombre del depósito de fotos en Supabase Storage
export const DEPOSITO_FOTOS = "fotos";

// Carpeta dentro del depósito donde se guardan las fotos
export const CARPETA_FOTOS = "productos";

// Fotos: tipos permitidos y tamaño máximo (igual que en Supabase)
export const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
export const MAXIMO_MB_FOTO = 5;

// Al subir una foto desde el panel se achica a este ancho (en píxeles)
export const ANCHO_MAXIMO_FOTO = 1400;

// Colores permitidos para las ofertas (variables de styles/variables.css)
export const COLORES_OFERTA = ["rojo", "naranja", "amarillo", "verde", "azul"];

// Tamaños permitidos para las fotos de la galería
export const TAMANOS_GALERIA = ["normal", "grande", "ancha"];

// Login: cuántos intentos fallidos antes de esperar, y cuántos minutos
export const INTENTOS_LOGIN = 5;
export const MINUTOS_BLOQUEO = 5;

// Pedido: cantidad máxima de un mismo producto
export const CANTIDAD_MAXIMA = 20;

// Píxeles que hay que bajar para que el menú se achique
export const ALTURA_MENU_ACHICADO = 40;
