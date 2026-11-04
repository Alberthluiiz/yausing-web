// =========================================================
// galeria.js · Fotos de la galería y visor para verlas en grande
// =========================================================

import { TAMANOS_GALERIA } from "../config.js";
import { textoSeguro, rutaImagenSegura, opcionSegura, ponerImagen } from "./seguridad.js";
import { copiarPlantilla, campo } from "./utilidades.js";

let fotos = [];
let fotoActual = 0;

const fotoGrande = document.getElementById("visor-foto");
const textoGrande = document.getElementById("visor-texto");

// Muestra en el visor la foto número "indice" (si se pasa del final, vuelve al inicio)
function mostrarFoto(indice) {
  fotoActual = (indice + fotos.length) % fotos.length;
  ponerImagen(fotoGrande, fotos[fotoActual].foto, fotos[fotoActual].texto);
  textoGrande.textContent = fotos[fotoActual].texto;
}

function crearFoto(item, indice) {
  const boton = copiarPlantilla("plantilla-foto");
  const tamano = opcionSegura(item.tamano, TAMANOS_GALERIA, "normal");
  if (tamano !== "normal") boton.classList.add(tamano);
  boton.dataset.indice = indice;
  ponerImagen(campo(boton, "foto"), item.foto, item.texto);
  campo(boton, "texto").textContent = item.texto;
  return boton;
}

export function iniciarGaleria(galeria) {
  // Limpiamos los datos una sola vez
  fotos = galeria.map((item) => ({
    foto: rutaImagenSegura(item.foto),
    texto: textoSeguro(item.texto, 60),
    tamano: item.tamano,
  }));
  if (fotos.length === 0) return;

  const contenedor = document.getElementById("lista-galeria");
  contenedor.replaceChildren(...fotos.map(crearFoto));

  const visor = new bootstrap.Modal("#visor");

  // Al tocar una foto se abre el visor
  contenedor.addEventListener("click", (evento) => {
    const foto = evento.target.closest(".galeria-foto");
    if (!foto) return;
    mostrarFoto(Number(foto.dataset.indice));
    visor.show();
  });

  // Flechas del visor y del teclado
  document.getElementById("visor-anterior").addEventListener("click", () => mostrarFoto(fotoActual - 1));
  document.getElementById("visor-siguiente").addEventListener("click", () => mostrarFoto(fotoActual + 1));
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") mostrarFoto(fotoActual - 1);
    if (evento.key === "ArrowRight") mostrarFoto(fotoActual + 1);
  });
}
