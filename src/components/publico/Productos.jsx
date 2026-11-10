// =========================================================
// Productos.jsx · Sección de productos con filtros por categoría
// - Se muestran POR_PAGINA productos y un botón "Ver más"
//   (así la página no queda larguísima en el celular)
// - Orden: destacados primero, agotados al final
// - Buscador: busca en nombre, descripción, categoría y colores
//   (sin importar tildes ni mayúsculas)
// =========================================================
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aparecer from "../comunes/Aparecer";
import Etiqueta from "../comunes/Etiqueta";
import TarjetaProducto from "./TarjetaProducto";
import { leerColor } from "../../utils/colores";
import { paraBuscar } from "../../utils/formato";
import { enlaceWhatsapp, mensajePedidoProducto } from "../../utils/whatsapp";

const TODOS = "todos";
const POR_PAGINA = 12; // cuántos productos se ven al inicio y en cada "Ver más"

export default function Productos({ tienda, productos, categorias }) {
  const [filtro, setFiltro] = useState(TODOS);
  const [cuantos, setCuantos] = useState(POR_PAGINA);
  const [busqueda, setBusqueda] = useState("");
  const navegar = useNavigate();

  // Nombre de la categoría de cada producto (id → nombre)
  const nombreCategoria = useMemo(
    () => Object.fromEntries(categorias.map((categoria) => [categoria.id, categoria.nombre])),
    [categorias],
  );

  // Solo se muestran las categorías que tienen productos
  const categoriasConProductos = categorias.filter((categoria) =>
    productos.some((producto) => producto.categoria_id === categoria.id),
  );

  // Cada palabra buscada debe aparecer en el producto ("blusa roja")
  const palabras = paraBuscar(busqueda).split(/\s+/).filter(Boolean);
  const coincide = (producto) => {
    if (palabras.length === 0) return true;
    const texto = paraBuscar(
      [
        producto.nombre,
        producto.descripcion,
        nombreCategoria[producto.categoria_id],
        ...producto.colores.map((valor) => leerColor(valor).nombre),
      ].join(" "),
    );
    return palabras.every((palabra) => texto.includes(palabra));
  };

  // Disponibles antes que agotados; luego destacados; luego por orden
  const filtrados = productos
    .filter((producto) => filtro === TODOS || producto.categoria_id === filtro)
    .filter(coincide)
    .sort(
      (a, b) =>
        Number(Boolean(a.agotado)) - Number(Boolean(b.agotado)) ||
        Number(Boolean(b.destacado)) - Number(Boolean(a.destacado)) ||
        a.orden - b.orden,
    );
  const visibles = filtrados.slice(0, cuantos);
  const faltan = filtrados.length - visibles.length;

  // Al cambiar de categoría se vuelve a mostrar solo la primera tanda
  const elegirFiltro = (id) => {
    setFiltro(id);
    setCuantos(POR_PAGINA);
  };
  const escribirBusqueda = (texto) => {
    setBusqueda(texto.slice(0, 60));
    setCuantos(POR_PAGINA);
  };

  return (
    <section id="productos" className="seccion seccion-hueso">
      <div className="container">
        <Aparecer className="encabezado">
          <Etiqueta>Productos</Etiqueta>
          <h2 className="titulo display-6">
            Nuestra <em>colección</em>
          </h2>
          <p className="texto-suave">Toca una prenda, elige tu talla y color, y pídela por WhatsApp.</p>
        </Aparecer>

        {/* Buscador */}
        <div className="buscador">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder="Busca: blusa, poncho, rojo..."
            value={busqueda}
            onChange={(evento) => escribirBusqueda(evento.target.value)}
            aria-label="Buscar productos"
            maxLength={60}
          />
        </div>

        {/* Botones para filtrar */}
        <div className="filtros" role="group" aria-label="Filtrar por categoría">
          {[{ id: TODOS, nombre: "Todos" }, ...categoriasConProductos].map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              className={`filtro ${filtro === categoria.id ? "activo" : ""}`}
              aria-pressed={filtro === categoria.id}
              onClick={() => elegirFiltro(categoria.id)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <div className="sin-productos">
            {palabras.length > 0 ? (
              <>
                <p className="mb-3">No encontramos "{busqueda.trim()}". Puede que lo tengamos en el local: pregúntanos.</p>
                <button type="button" className="btn btn-borde rounded-pill px-4" onClick={() => escribirBusqueda("")}>
                  Ver todo
                </button>
              </>
            ) : (
              <p>Muy pronto tendremos productos en esta categoría.</p>
            )}
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-lg-4 g-3 g-lg-4">
            {visibles.map((producto) => (
              <TarjetaProducto
                key={`${filtro}-${producto.id}`}
                producto={producto}
                categoria={nombreCategoria[producto.categoria_id]}
                enlaceDirecto={enlaceWhatsapp(tienda.whatsapp, mensajePedidoProducto(tienda.nombre, producto))}
                alAbrir={() => navegar(`/producto/${producto.id}`, { state: { desdeLista: true } })}
              />
            ))}
          </div>
        )}

        {/* Botón "Ver más": aparece solo si quedan productos por mostrar */}
        {faltan > 0 && (
          <div className="ver-mas">
            <button type="button" className="btn btn-borde rounded-pill px-4" onClick={() => setCuantos((n) => n + POR_PAGINA)}>
              Ver más prendas <span className="ver-mas-cuenta">({faltan})</span>
              <i className="bi bi-chevron-down ms-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
