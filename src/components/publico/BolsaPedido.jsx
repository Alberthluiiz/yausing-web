// =========================================================
// BolsaPedido.jsx · Panel lateral "Mi pedido"
// Muestra lo que el cliente eligió y lo manda todo junto por WhatsApp.
// Los precios se toman SIEMPRE de los datos actuales de la tienda
// (si Mary cambia un precio, el pedido se actualiza solo).
// =========================================================
import { useEffect } from "react";
import { usePedido } from "../../store/pedidoStore";
import { CANTIDAD_MAXIMA } from "../../utils/constantes";
import { precioTexto } from "../../utils/formato";
import { precioDeTalla } from "../../utils/tallas";
import { enlaceWhatsapp, mensajePedido } from "../../utils/whatsapp";

export default function BolsaPedido({ tienda, productos }) {
  const { items, abierto, cerrar, cambiarCantidad, quitar, vaciar } = usePedido();

  // Cerrar con la tecla Esc
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (evento) => evento.key === "Escape" && cerrar();
    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, [abierto, cerrar]);

  if (!abierto) return null;

  // Une cada línea del pedido con el producto actual (si fue borrado, se quita)
  const lineas = items
    .map((item) => {
      const producto = productos.find((p) => p.id === item.id);
      return producto ? { ...item, nombre: producto.nombre, precio: precioDeTalla(producto, item.talla) } : null;
    })
    .filter(Boolean);
  const total = lineas.reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0);

  return (
    <>
      <div className="ventana-fondo" onClick={cerrar} aria-hidden="true" />
      <aside className="bolsa" role="dialog" aria-modal="true" aria-label="Mi pedido">
        <div className="bolsa-cabeza">
          <h2>Mi pedido</h2>
          <button type="button" className="btn btn-light rounded-circle" onClick={cerrar} aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {lineas.length === 0 ? (
          <div className="bolsa-vacia">
            <i className="bi bi-bag-heart d-block mb-2" />
            Aún no elegiste nada.
            <br />
            Toca una prenda y presiona <strong>“Agregar a mi pedido”</strong>.
          </div>
        ) : (
          <>
            <ul className="bolsa-lista">
              {lineas.map((linea) => (
                <li className="bolsa-item" key={linea.clave}>
                  <div className="d-flex justify-content-between gap-2">
                    <strong>{linea.nombre}</strong>
                    <span>{precioTexto(linea.precio * linea.cantidad)}</span>
                  </div>
                  <small>{[linea.talla && `Talla ${linea.talla}`, linea.color && `Color ${linea.color}`].filter(Boolean).join(" · ") || " "}</small>
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <div className="cantidad">
                      <button type="button" aria-label="Menos" onClick={() => cambiarCantidad(linea.clave, linea.cantidad - 1)}>
                        −
                      </button>
                      <span>{linea.cantidad}</span>
                      <button
                        type="button"
                        aria-label="Más"
                        disabled={linea.cantidad >= CANTIDAD_MAXIMA}
                        onClick={() => cambiarCantidad(linea.clave, linea.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => quitar(linea.clave)}>
                      <i className="bi bi-trash3 me-1" />
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bolsa-pie">
              <div className="d-flex justify-content-between mb-3 fs-5">
                <span>Total</span>
                <strong>{precioTexto(total)}</strong>
              </div>
              <a
                className="btn btn-whatsapp btn-lg rounded-pill w-100"
                href={enlaceWhatsapp(tienda.whatsapp, mensajePedido(tienda.nombre, lineas))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-whatsapp me-2" />
                Enviar pedido por WhatsApp
              </a>
              <button type="button" className="btn btn-link w-100 mt-1 text-secondary" onClick={vaciar}>
                Vaciar pedido
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
