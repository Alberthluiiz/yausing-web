// =========================================================
// LayoutAdmin.jsx · Marco del panel: menú a la izquierda
// (arriba en el celular) y la página elegida a la derecha.
// =========================================================
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/img/yausig-logo.svg";
import { cerrarSesion } from "../../supabase/auth";
import { useSesion } from "../../hooks/useSesion";

// Opciones del menú del panel (para agregar una, ponla aquí y en routes/AppRouter.jsx)
const OPCIONES = [
  { a: "/admin", icono: "bi-house", texto: "Inicio", exacto: true },
  { a: "/admin/productos", icono: "bi-bag", texto: "Productos" },
  { a: "/admin/ofertas", icono: "bi-fire", texto: "Ofertas" },
  { a: "/admin/galeria", icono: "bi-images", texto: "Galería" },
  { a: "/admin/categorias", icono: "bi-tags", texto: "Categorías" },
  { a: "/admin/fotos", icono: "bi-cloud-arrow-up", texto: "Fotos" },
  { a: "/admin/tienda", icono: "bi-shop", texto: "Datos de la tienda" },
];

export default function LayoutAdmin() {
  const navegar = useNavigate();
  const { usuario } = useSesion();

  async function salir() {
    await cerrarSesion();
    navegar("/admin/login", { replace: true });
  }

  const enlaces = OPCIONES.map((opcion) => (
    <NavLink key={opcion.a} to={opcion.a} end={opcion.exacto}>
      <i className={`bi ${opcion.icono}`} />
      {opcion.texto}
    </NavLink>
  ));

  return (
    <div className="admin">
      {/* Celular: menú arriba, se desliza de lado */}
      <nav className="admin-barra d-md-none" aria-label="Menú del panel">
        {enlaces}
        <button type="button" onClick={salir}>
          <i className="bi bi-box-arrow-right" /> Salir
        </button>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Computadora: menú a la izquierda */}
          <aside className="col-md-3 col-xl-2 d-none d-md-block admin-menu">
            <a href="/" className="logo" target="_blank" rel="noopener noreferrer" title="Ver la web">
              <img src={logo} alt="Yausig Churikuna" />
            </a>
            <nav aria-label="Menú del panel">{enlaces}</nav>
            <hr />
            <a href="/" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-box-arrow-up-right" />
              Ver la web
            </a>
            <button type="button" onClick={salir}>
              <i className="bi bi-box-arrow-right" />
              Cerrar sesión
            </button>
            <small className="d-block mt-4 px-3 text-white-50 text-break">{usuario?.email}</small>
          </aside>

          <main className="col-md-9 col-xl-10 admin-contenido">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
