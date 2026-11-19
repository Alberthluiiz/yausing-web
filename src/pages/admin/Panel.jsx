// =========================================================
// Panel.jsx · Inicio del panel: resumen y accesos rápidos
// =========================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { productos, ofertas, galeria, categorias } from "../../supabase/consultas";
import { productosMasPedidos } from "../../supabase/pedidos";
import { descargarCopia } from "../../supabase/copia";
import { mensajeDeError } from "../../utils/errores";

const TARJETAS = [
  { clave: "productos", texto: "Productos", a: "/admin/productos", color: "var(--rojo)" },
  { clave: "ofertas", texto: "Ofertas", a: "/admin/ofertas", color: "var(--naranja)" },
  { clave: "galeria", texto: "Fotos en galería", a: "/admin/galeria", color: "var(--verde)" },
  { clave: "categorias", texto: "Categorías", a: "/admin/categorias", color: "var(--azul)" },
];

export default function Panel() {
  useTituloPagina("Panel");
  const [totales, setTotales] = useState(null);
  const [error, setError] = useState("");
  const [masPedidos, setMasPedidos] = useState(null);
  const [copia, setCopia] = useState(""); // "", "haciendo", "lista"

  useEffect(() => {
    Promise.all([productos.listar(), ofertas.listar(), galeria.listar(), categorias.listar()])
      .then(([p, o, g, c]) =>
        setTotales({
          productos: p.length,
          ofertas: o.length,
          galeria: g.length,
          categorias: c.length,
          escondidos: p.filter((x) => !x.publicado).length,
        }),
      )
      .catch((e) => setError(mensajeDeError(e)));
    productosMasPedidos(30)
      .then(setMasPedidos)
      .catch(() => setMasPedidos([]));
  }, []);

  async function hacerCopia() {
    setCopia("haciendo");
    try {
      await descargarCopia();
      setCopia("lista");
    } catch (e) {
      setError(mensajeDeError(e));
      setCopia("");
    }
  }

  return (
    <>
      <h1 className="admin-titulo">¡Hola! 👋</h1>
      <p className="text-secondary mb-4">Desde aquí cambias todo lo que se ve en la web.</p>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {TARJETAS.map((tarjeta) => (
          <div className="col-6 col-lg-3" key={tarjeta.clave}>
            <Link to={tarjeta.a} className="resumen" style={{ borderTopColor: tarjeta.color }}>
              <strong>{totales ? totales[tarjeta.clave] : "…"}</strong>
              <small>{tarjeta.texto}</small>
            </Link>
          </div>
        ))}
      </div>

      {totales?.escondidos > 0 && (
        <div className="alert alert-warning">
          Tienes {totales.escondidos} producto(s) escondido(s): no se ven en la web.
        </div>
      )}

      <div className="admin-caja mb-4">
        <h2 className="h5 mb-1">Lo más pedido</h2>
        <p className="text-secondary small mb-3">Veces que tocaron "Pedir por WhatsApp" en los últimos 30 días.</p>
        {masPedidos === null ? (
          <p className="text-secondary mb-0">Cargando…</p>
        ) : masPedidos.length === 0 ? (
          <p className="text-secondary mb-0">
            Todavía no hay pedidos contados. Aparecerán aquí cuando los clientes pidan.
          </p>
        ) : (
          <ol className="mas-pedidos">
            {masPedidos.map((item) => (
              <li key={item.producto_id}>
                <span>{item.nombre}</span>
                <strong>{item.pedidos}</strong>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="admin-caja mb-4">
        <h2 className="h5 mb-1">Copia de seguridad</h2>
        <p className="text-secondary small mb-3">
          Descarga un archivo con todos los productos, ofertas y datos de la tienda. Guárdalo una vez al mes en tu
          computadora o en Google Drive.
        </p>
        <button
          type="button"
          className="btn btn-outline-dark rounded-pill"
          onClick={hacerCopia}
          disabled={copia === "haciendo"}
        >
          <i className="bi bi-download me-1" />
          {copia === "haciendo" ? "Preparando…" : "Descargar copia"}
        </button>
        {copia === "lista" && <span className="text-success small ms-2">¡Listo! Revisa tus descargas.</span>}
      </div>

      <div className="admin-caja">
        <h2 className="h5 mb-3">¿Qué quieres hacer?</h2>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/productos?nuevo=1" className="btn btn-rojo rounded-pill">
            <i className="bi bi-plus-lg me-1" /> Agregar producto
          </Link>
          <Link to="/admin/ofertas?nuevo=1" className="btn btn-outline-dark rounded-pill">
            <i className="bi bi-fire me-1" /> Nueva oferta
          </Link>
          <Link to="/admin/galeria?nuevo=1" className="btn btn-outline-dark rounded-pill">
            <i className="bi bi-image me-1" /> Foto para la galería
          </Link>
          <Link to="/admin/tienda" className="btn btn-outline-dark rounded-pill">
            <i className="bi bi-clock me-1" /> Cambiar horario o teléfono
          </Link>
        </div>
      </div>
    </>
  );
}
