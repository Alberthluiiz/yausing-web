// =========================================================
// animaciones.js · Hace aparecer suave cada elemento con la
// clase "aparecer" cuando llega a la pantalla
// =========================================================

export function iniciarAnimaciones() {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target); // solo una vez
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".aparecer").forEach((elemento) => observador.observe(elemento));
}
