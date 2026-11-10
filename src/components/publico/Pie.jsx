// Pie.jsx · Pie de página
import Franja from "../comunes/Franja";
import logo from "../../assets/img/yausig-logo.svg";

export default function Pie({ tienda }) {
  return (
    <>
      <Franja />
      <footer className="pie">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-4 text-center text-md-start">
              <img src={logo} alt="Yausig Churikuna" className="pie-logo" />
            </div>
            <div className="col-md-4 text-center">
              <p className="mb-0 small">{tienda.direccion}</p>
            </div>
            <div className="col-md-4 text-center text-md-end small">
              © {new Date().getFullYear()} {tienda.nombre}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
