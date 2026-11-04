// =========================================================
// utilidades.js · Funciones pequeñas que usan varios archivos
// =========================================================

// Copia una plantilla (<template>) del index.html y devuelve su contenido
export function copiarPlantilla(id) {
  return document.getElementById(id).content.firstElementChild.cloneNode(true);
}

// Busca dentro de una tarjeta el elemento con data-campo="nombre"
export function campo(tarjeta, nombre) {
  return tarjeta.querySelector(`[data-campo="${nombre}"]`);
}

// Escribe un precio bonito dentro de un elemento:  $ (pequeño) 35 (grande) .00 (pequeño)
export function escribirPrecio(elemento, valor) {
  const [enteros, centavos] = valor.toFixed(2).split(".");

  const signo = document.createElement("sup");
  signo.textContent = "$";
  const numero = document.createElement("strong");
  numero.textContent = enteros;
  const decimales = document.createElement("span");
  decimales.textContent = `.${centavos}`;

  elemento.replaceChildren(signo, numero, decimales);
}
