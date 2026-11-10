// =========================================================
// RutaProtegida.jsx · Puerta del panel (chequeo 4)
//
// Si nadie inició sesión, o la persona no es administradora,
// la manda al login. Esto es la puerta "visible"; la protección
// REAL está en la base de datos (RLS): aunque alguien se saltara
// esta pantalla, Supabase no le deja cambiar nada.
// =========================================================
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSesion } from "../hooks/useSesion";
import Cargando from "../components/comunes/Cargando";

export default function RutaProtegida() {
  const { usuario, esAdmin, cargando } = useSesion();
  const ubicacion = useLocation();

  if (cargando) return <Cargando texto="Revisando tu sesión..." />;
  if (!usuario || !esAdmin) {
    return <Navigate to="/admin/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  return <Outlet />;
}
