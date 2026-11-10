// NoEncontrada.jsx · Página que se ve si la dirección no existe (error 404)
import { Link } from "react-router-dom";
import icono from "../../assets/img/yausig-icono.svg";
import { useTituloPagina } from "../../hooks/useTituloPagina";

export default function NoEncontrada() {
  useTituloPagina("Página no encontrada");
  return (
    <div className="no-encontrada">
      <div>
        <img src={icono} alt="" />
        <h1 className="titulo">Esta página no existe</h1>
        <p className="texto-suave">Puede que el enlace esté mal escrito o que el producto ya no esté.</p>
        <Link to="/" className="btn btn-rojo rounded-pill px-4">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
