// =========================================================
// TarjetaProducto.jsx · Tarjeta de UN producto
// - Tocar la tarjeta abre el detalle (para elegir talla, color, cantidad)
// - Si el producto no tiene tallas ni colores, el botón verde
//   va directo a WhatsApp con el nombre y el precio
// - Si está agotado: se ve en gris con la cinta "Agotado" y el
//   botón abre el detalle (ahí puede pedir que le avisen)
// =========================================================
import Foto from "../comunes/Foto";
import Precio from "../comunes/Precio";
import Circulo from "../comunes/Circulo";
import { leerTalla, precioDesde, precioVariable } from "../../utils/tallas";

export default function TarjetaProducto({ producto, categoria, enlaceDirecto, alAbrir }) {
  // Si está agotado, el botón siempre abre el detalle (no pide directo)
  const tieneOpciones = producto.agotado || producto.tallas.length > 0 || producto.colores.length > 0;

  // Abrir con el teclado (Enter o espacio) también
  const alTeclear = (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      alAbrir();
    }
  };

  return (
    <div className="col producto-col">
      <article
        className={`producto ${producto.agotado ? "agotado" : ""}`}
        onClick={alAbrir}
        onKeyDown={alTeclear}
        tabIndex={0}
        role="button"
        aria-label={`Ver ${producto.nombre}${producto.agotado ? " (agotado)" : ""}`}
      >
        <div className="producto-foto">
          <Foto ruta={producto.foto_ruta} alt={producto.nombre} />
          {categoria && <span className="producto-categoria">{categoria}</span>}
          {producto.agotado ? (
            <span className="producto-agotado">Agotado</span>
          ) : (
            producto.destacado && <span className="producto-destacado">★ Destacado</span>
          )}
        </div>
        <div className="producto-cuerpo">
          <h3>{producto.nombre}</h3>
          {producto.descripcion && <p>{producto.descripcion}</p>}
          {producto.tallas.length > 0 && (
            <div className="etiquetas" aria-label="Tallas">
              {producto.tallas.map((valor) => (
                <span key={valor}>{leerTalla(valor).nombre}</span>
              ))}
            </div>
          )}
          {producto.colores.length > 0 && (
            <div className="colores" aria-label="Colores disponibles">
              {producto.colores.map((valor) => (
                <Circulo key={valor} valor={valor} tamano={18} />
              ))}
            </div>
          )}
          <div className="precio-fila">
            <div className="precio">
              <small>{precioVariable(producto) ? "Desde" : "Precio"}</small>
              <Precio valor={precioDesde(producto)} />
            </div>
            {tieneOpciones ? (
              <button
                type="button"
                className="boton-pedir"
                aria-label={
                  producto.agotado ? `Ver ${producto.nombre} (agotado)` : `Elegir talla o color de ${producto.nombre}`
                }
                onClick={(evento) => {
                  evento.stopPropagation();
                  alAbrir();
                }}
              >
                <i className="bi bi-whatsapp" />
              </button>
            ) : (
              <a
                className="boton-pedir"
                href={enlaceDirecto}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Pedir ${producto.nombre} por WhatsApp`}
                onClick={(evento) => evento.stopPropagation()}
              >
                <i className="bi bi-whatsapp" />
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
