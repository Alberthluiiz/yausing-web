// =========================================================
// productos.js · Muestra los productos y los botones de filtro
// =========================================================

import {
  textoSeguro,
  numeroSeguro,
  rutaImagenSegura,
  colorSeguro,
  ponerImagen,
} from "./seguridad.js";
import { copiarPlantilla, campo, escribirPrecio } from "./utilidades.js";
import { enlaceWhatsapp } from "./whatsapp.js";

const lista = document.getElementById("lista-productos");
const filtros = document.getElementById("filtros");

// Crea la tarjeta de UN producto usando la plantilla del index.html
function crearProducto(producto) {
  const nombre = textoSeguro(producto.nombre, 80);
  const precio = numeroSeguro(producto.precio);
  const tarjeta = copiarPlantilla("plantilla-producto");

  // Foto (o dibujo de referencia)
  ponerImagen(campo(tarjeta, "foto"), rutaImagenSegura(producto.foto), nombre);
  if (producto.dibujo === true) {
    tarjeta.querySelector(".producto-foto").classList.add("dibujo");
    campo(tarjeta, "nota").hidden = false;
  }

  // Textos
  campo(tarjeta, "categoria").textContent = textoSeguro(producto.categoria, 30);
  campo(tarjeta, "nombre").textContent = nombre;
  campo(tarjeta, "descripcion").textContent = textoSeguro(
    producto.descripcion,
    120,
  );
  escribirPrecio(campo(tarjeta, "precio"), precio);

  // Bolitas de colores
  const colores = Array.isArray(producto.colores) ? producto.colores : [];
  colores.slice(0, 6).forEach((color) => {
    const bolita = document.createElement("span");
    bolita.style.backgroundColor = colorSeguro(color);
    campo(tarjeta, "colores").append(bolita);
  });

  // Botón de WhatsApp con el nombre del producto
  campo(tarjeta, "whatsapp").href = enlaceWhatsapp(
    `Hola, me interesa: ${nombre} ($${precio.toFixed(2)})`,
  );

  return tarjeta;
}

// Muestra solo los productos de una categoría ("Todos" = todos)
function mostrar(productos, categoria) {
  const elegidos =
    categoria === "Todos"
      ? productos
      : productos.filter((producto) => producto.categoria === categoria);
  lista.replaceChildren(...elegidos.map(crearProducto));
}

// Crea los botones de filtro y muestra todos los productos al inicio
export function iniciarProductos(productos, categorias) {
  const botones = categorias.map((categoria, posicion) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "filtro";
    boton.textContent = textoSeguro(categoria, 30);
    boton.dataset.categoria = boton.textContent;
    if (posicion === 0) boton.classList.add("activo");
    return boton;
  });
  filtros.replaceChildren(...botones);

  // Al tocar un filtro: se marca y se muestran sus productos
  filtros.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".filtro");
    if (!boton) return;
    filtros.querySelector(".activo")?.classList.remove("activo");
    boton.classList.add("activo");
    mostrar(productos, boton.dataset.categoria);
  });

  mostrar(productos, "Todos");
}
