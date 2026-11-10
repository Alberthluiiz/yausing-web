// =========================================================
// AppRouter.jsx · Todas las direcciones (rutas) de la web
//
//   /                  → tienda (pública)
//   /producto/:id      → tienda con el producto abierto (pública)
//   /admin/login       → entrar al panel
//   /admin/...         → panel (solo administradores)
//   cualquier otra     → página "no existe" (404)
// =========================================================
import { lazy, Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { TiendaProvider } from "../context/TiendaContext";
import RutaProtegida from "./RutaProtegida";
import Cargando from "../components/comunes/Cargando";
import Inicio from "../pages/publico/Inicio";
import NoEncontrada from "../pages/publico/NoEncontrada";

// El panel se descarga SOLO cuando alguien entra a /admin
// (así la tienda carga más rápido para los clientes)
const Login = lazy(() => import("../pages/admin/Login"));
const LayoutAdmin = lazy(() => import("../components/admin/LayoutAdmin"));
const Panel = lazy(() => import("../pages/admin/Panel"));
const ProductosAdmin = lazy(() => import("../pages/admin/Productos"));
const OfertasAdmin = lazy(() => import("../pages/admin/Ofertas"));
const GaleriaAdmin = lazy(() => import("../pages/admin/Galeria"));
const CategoriasAdmin = lazy(() => import("../pages/admin/Categorias"));
const FotosAdmin = lazy(() => import("../pages/admin/Fotos"));
const TiendaAdmin = lazy(() => import("../pages/admin/Tienda"));

// Las páginas públicas comparten los datos de la tienda
function LayoutPublico() {
  return (
    <TiendaProvider>
      <Outlet />
    </TiendaProvider>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Cargando />}>
        <Routes>
          {/* Web pública */}
          <Route element={<LayoutPublico />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/producto/:id" element={<Inicio />} />
          </Route>

          {/* Panel */}
          <Route path="/admin/login" element={<Login />} />
          <Route element={<RutaProtegida />}>
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route index element={<Panel />} />
              <Route path="productos" element={<ProductosAdmin />} />
              <Route path="ofertas" element={<OfertasAdmin />} />
              <Route path="galeria" element={<GaleriaAdmin />} />
              <Route path="categorias" element={<CategoriasAdmin />} />
              <Route path="fotos" element={<FotosAdmin />} />
              <Route path="tienda" element={<TiendaAdmin />} />
            </Route>
          </Route>

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
