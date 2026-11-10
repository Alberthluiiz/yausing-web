// =========================================================
// DetalleProducto.jsx · Ventana con el producto en grande
// El cliente elige talla, color y cantidad, y puede:
//   1) Pedirlo directo por WhatsApp (mensaje con todo lo que eligió)
//   2) Agregarlo a "Mi pedido" para pedir varios juntos
// Si está AGOTADO: en vez de pedir, el cliente puede escribir
// "avísenme cuando llegue" (con la talla y color que quiere).
// =========================================================
import { useState } from "react";
import Ventana from "../comunes/Ventana";
import Foto from "../comunes/Foto";
import Precio from "../comunes/Precio";
import Etiqueta from "../comunes/Etiqueta";
import Circulo from "../comunes/Circulo";
import { leerColor } from "../../utils/colores";
import { usePedido } from "../../store/pedidoStore";
import { CANTIDAD_MAXIMA } from "../../utils/constantes";
import { precioTexto } from "../../utils/formato";
import { leerTalla, precioDeTalla, precioDesde, precioVariable } from "../../utils/tallas";
import { enlaceWhatsapp, mensajeAgotado, mensajePedidoProducto } from "../../utils/whatsapp";

// Botones para elegir una opción (talla o color)
function Opciones({ titulo, lista, elegida, alElegir }) {
  if (lista.length === 0) return null;
  return (
    <>
      <span className="opciones-titulo">{titulo}</span>
      <div className="opciones" role="radiogroup" aria-label={titulo}>
        {lista.map((opcion) => (
          <button
            key={opcion}
            type="button"
            role="radio"
            aria-checked={elegida === opcion}
            className={`opcion ${elegida === opcion ? "activo" : ""}`}
            onClick={() => alElegir(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>
    </>
  );
}

// Circulitos para elegir el color. Se guarda el NOMBRE del color (para el mensaje).
function OpcionesColor({ lista, elegido, alElegir }) {
  if (lista.length === 0) return null;
  return (
    <>
      <span className="opciones-titulo">
        Color{elegido && <span className="color-elegido">: {elegido}</span>}
      </span>
      <div className="opciones" role="radiogroup" aria-label="Color">
        {lista.map((valor) => {
          const { nombre, hex } = leerColor(valor);
          return (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={elegido === nombre}
              aria-label={nombre}
              title={nombre}
              className={`opcion-color ${hex ? "" : "texto"} ${elegido === nombre ? "activo" : ""}`}
              onClick={() => alElegir(nombre)}
            >
              <Circulo valor={valor} tamano={32} />
            </button>
          );
        })}
      </div>
    </>
  );
}

export default function DetalleProducto({ producto, categoria, tienda, alCerrar }) {
  // Si solo hay una opción, se elige sola
  const nombresTallas = producto.tallas.map((valor) => leerTalla(valor).nombre);
  const [talla, setTalla] = useState(nombresTallas.length === 1 ? nombresTallas[0] : "");
  const [color, setColor] = useState(producto.colores.length === 1 ? leerColor(producto.colores[0]).nombre : "");
  const [cantidad, setCantidad] = useState(1);
  const agregar = usePedido((estado) => estado.agregar);

  // Falta elegir algo
  const faltaTalla = producto.tallas.length > 0 && !talla;
  const faltaColor = producto.colores.length > 0 && !color;
  const falta = faltaTalla || faltaColor;
  const aviso = faltaTalla && faltaColor ? "Elige tu talla y color" : faltaTalla ? "Elige tu talla" : "Elige tu color";

  // Precio: el de la talla elegida. Si aún no elige y varía, se muestra "Desde"
  const variable = precioVariable(producto);
  const precio = talla ? precioDeTalla(producto, talla) : precioDesde(producto);
  const mostrarDesde = variable && !talla;

  const enlace = enlaceWhatsapp(
    tienda.whatsapp,
    mensajePedidoProducto(tienda.nombre, producto, { talla, color, cantidad, precio }),
  );
  const enlaceAvisame = enlaceWhatsapp(tienda.whatsapp, mensajeAgotado(tienda.nombre, producto, { talla, color }));

  return (
    <Ventana titulo={producto.nombre} alCerrar={alCerrar} className="detalle">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="detalle-foto">
            <Foto ruta={producto.foto_ruta} alt={producto.nombre} perezosa={false} />
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column">
          {categoria && <Etiqueta>{categoria}</Etiqueta>}
          <h2>{producto.nombre}</h2>
          {producto.agotado && (
            <p className="aviso-agotado">
              <i className="bi bi-info-circle me-2" />
              Por ahora está agotado. Escríbenos y te avisamos cuando vuelva a llegar.
            </p>
          )}
          <div>
            {mostrarDesde && <small className="d-block text-secondary text-uppercase small fw-semibold">Desde</small>}
            <Precio valor={precio} />
          </div>
          {mostrarDesde && <small className="text-secondary">El precio cambia según la talla.</small>}
          {producto.descripcion && <p className="texto-suave mt-3 mb-0">{producto.descripcion}</p>}

          <Opciones titulo="Talla" lista={nombresTallas} elegida={talla} alElegir={setTalla} />
          <OpcionesColor lista={producto.colores} elegido={color} alElegir={setColor} />

          {!producto.agotado && (
            <>
              <span className="opciones-titulo">Cantidad</span>
              <div className="cantidad">
                <button type="button" aria-label="Menos" onClick={() => setCantidad((n) => Math.max(1, n - 1))}>
                  −
                </button>
                <span aria-live="polite">{cantidad}</span>
                <button
                  type="button"
                  aria-label="Más"
                  onClick={() => setCantidad((n) => Math.min(CANTIDAD_MAXIMA, n + 1))}
                >
                  +
                </button>
              </div>
              {cantidad > 1 && !mostrarDesde && <small className="text-secondary mt-2">Total: {precioTexto(precio * cantidad)}</small>}
            </>
          )}

          <div className="mt-4 pt-2 d-grid gap-2 mt-auto">
            {producto.agotado ? (
              <a className="btn btn-whatsapp btn-lg rounded-pill" href={enlaceAvisame} target="_blank" rel="noopener noreferrer">
                <i className="bi bi-bell me-2" />
                Avísame cuando llegue
              </a>
            ) : (
              <>
                {falta ? (
                  <button type="button" className="btn btn-whatsapp btn-lg rounded-pill" disabled>
                    <i className="bi bi-hand-index me-2" />
                    {aviso}
                  </button>
                ) : (
                  <a className="btn btn-whatsapp btn-lg rounded-pill" href={enlace} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-whatsapp me-2" />
                    Pedir por WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn-borde rounded-pill"
                  disabled={falta}
                  onClick={() => {
                    agregar({ ...producto, precio }, { talla, color, cantidad });
                    alCerrar();
                  }}
                >
                  <i className="bi bi-bag-plus me-2" />
                  Agregar a mi pedido
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Ventana>
  );
}
