// =========================================================
// Inicio.jsx · La web pública (una sola página con secciones)
//
// También se usa para /producto/:id → abre el detalle del producto
// encima de la página (así cada producto tiene su propio enlace).
// =========================================================
import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTienda } from "../../hooks/useTienda";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { enlaceWhatsapp, mensajeGeneral } from "../../utils/whatsapp";
import Franja from "../../components/comunes/Franja";
import Menu from "../../components/publico/Menu";
import Portada from "../../components/publico/Portada";
import Nosotros from "../../components/publico/Nosotros";
import Productos from "../../components/publico/Productos";
import DetalleProducto from "../../components/publico/DetalleProducto";
import Ofertas from "../../components/publico/Ofertas";
import Galeria from "../../components/publico/Galeria";
import Contacto from "../../components/publico/Contacto";
import Pie from "../../components/publico/Pie";
import WhatsappFlotante from "../../components/publico/WhatsappFlotante";
import BolsaPedido from "../../components/publico/BolsaPedido";

// Esqueleto gris mientras llegan los datos
function PantallaCargando() {
  return (
    <div className="container py-5" aria-busy="true" aria-label="Cargando la tienda">
      <div className="row row-cols-2 row-cols-lg-4 g-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="col" key={i}>
            <div className="cargando-tarjeta" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Inicio() {
  const { datos, cargando, error, recargar } = useTienda();
  const { id } = useParams();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  // Cerrar el detalle: si vino de la lista, vuelve atrás; si abrió el enlace directo, va al inicio
  const cerrarDetalle = useCallback(() => {
    if (ubicacion.state?.desdeLista) navegar(-1);
    else navegar("/", { replace: true });
  }, [ubicacion.state, navegar]);

  const productoAbierto = datos && id ? datos.productos.find((producto) => producto.id === id) : null;
  useTituloPagina(productoAbierto?.nombre);

  if (cargando && !datos) return <PantallaCargando />;

  if (error || !datos) {
    return (
      <div className="no-encontrada">
        <div>
          <p className="mb-3">{error}</p>
          <button type="button" className="btn btn-rojo rounded-pill px-4" onClick={recargar}>
            Intentar otra vez
          </button>
        </div>
      </div>
    );
  }

  const { tienda, categorias, productos, ofertas, galeria } = datos;
  const enlaceGeneral = enlaceWhatsapp(tienda.whatsapp, mensajeGeneral(tienda.nombre));
  const categoriaDe = (producto) => categorias.find((c) => c.id === producto.categoria_id)?.nombre;

  return (
    <>
      <Menu enlaceWhatsapp={enlaceGeneral} />
      <Franja />
      <main>
        <Portada
          tienda={tienda}
          enlaceWhatsapp={enlaceGeneral}
        />
        <Nosotros />
        <Productos tienda={tienda} productos={productos} categorias={categorias} />
        <Ofertas tienda={tienda} ofertas={ofertas} />
        <Galeria tienda={tienda} fotos={galeria} />
        <Contacto tienda={tienda} />
      </main>
      <Pie tienda={tienda} />
      <WhatsappFlotante enlace={enlaceGeneral} />
      <BolsaPedido tienda={tienda} productos={productos} />

      {productoAbierto && (
        <DetalleProducto
          key={productoAbierto.id}
          producto={productoAbierto}
          categoria={categoriaDe(productoAbierto)}
          tienda={tienda}
          alCerrar={cerrarDetalle}
        />
      )}
    </>
  );
}
