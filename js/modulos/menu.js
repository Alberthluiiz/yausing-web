// =========================================================
// menu.js · Menú de arriba
// - Se cierra en el celular al elegir una opción
// - Se achica al bajar
// - Marca con una rayita la sección en la que estás
// =========================================================

import { ALTURA_MENU_ACHICADO } from "../config.js";

export function iniciarMenu() {
  const menu = document.getElementById("menu");
  const enlaces = document.querySelectorAll("#menuPrincipal .nav-link");
  const secciones = document.querySelectorAll("main section[id]");

  // Cerrar el menú del celular al tocar un enlace
  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      bootstrap.Collapse.getOrCreateInstance("#menuPrincipal", { toggle: false }).hide();
    });
  });

  function alBajar() {
    menu.classList.toggle("achicado", window.scrollY > ALTURA_MENU_ACHICADO);

    let actual = "inicio";
    secciones.forEach((seccion) => {
      if (window.scrollY >= seccion.offsetTop - 120) actual = seccion.id;
    });
    enlaces.forEach((enlace) => {
      enlace.classList.toggle("activo", enlace.getAttribute("href") === `#${actual}`);
    });
  }

  window.addEventListener("scroll", alBajar, { passive: true });
  alBajar();
}
