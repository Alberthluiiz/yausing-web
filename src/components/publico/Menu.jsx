// =========================================================
// Menu.jsx · Menú de arriba
// - En el celular se abre con el botón ☰ y se cierra al elegir
// - Se achica al bajar y marca la sección en la que estás
// =========================================================
import { useEffect, useState } from "react";
import logo from "../../assets/img/yausig-logo.svg";
import { ALTURA_MENU_ACHICADO } from "../../utils/constantes";
import { usePedido } from "../../store/pedidoStore";

// Para agregar o quitar una opción del menú, cámbiala aquí
const ENLACES = [
  { id: "inicio", texto: "Inicio" },
  { id: "nosotros", texto: "Nosotros" },
  { id: "productos", texto: "Productos" },
  { id: "ofertas", texto: "Ofertas" },
  { id: "galeria", texto: "Galería" },
  { id: "contacto", texto: "Contacto" },
];

export default function Menu({ enlaceWhatsapp }) {
  const [abierto, setAbierto] = useState(false);
  const [achicado, setAchicado] = useState(false);
  const [actual, setActual] = useState("inicio");
  const cantidad = usePedido((estado) => estado.items.reduce((suma, item) => suma + item.cantidad, 0));
  const abrirBolsa = usePedido((estado) => estado.abrir);

  useEffect(() => {
    function alBajar() {
      setAchicado(window.scrollY > ALTURA_MENU_ACHICADO);
      let visible = "inicio";
      for (const { id } of ENLACES) {
        const seccion = document.getElementById(id);
        if (seccion && window.scrollY >= seccion.offsetTop - 120) visible = id;
      }
      setActual(visible);
    }
    window.addEventListener("scroll", alBajar, { passive: true });
    alBajar();
    return () => window.removeEventListener("scroll", alBajar);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg sticky-top menu ${achicado ? "achicado" : ""}`}>
      <div className="container">
        <a className="navbar-brand" href="#inicio">
          <img src={logo} alt="Yausig Churikuna" className="menu-logo" />
        </a>

        <div className="d-flex align-items-center gap-2 order-lg-last">
          <button type="button" className="boton-bolsa" onClick={abrirBolsa} aria-label="Ver mi pedido">
            <i className="bi bi-bag-heart" />
            {cantidad > 0 && <b>{cantidad}</b>}
          </button>
          <button
            type="button"
            className="navbar-toggler"
            onClick={() => setAbierto(!abierto)}
            aria-expanded={abierto}
            aria-controls="menuPrincipal"
            aria-label="Abrir menú"
          >
            <i className={`bi ${abierto ? "bi-x-lg" : "bi-list"}`} />
          </button>
        </div>

        <div className={`navbar-collapse ${abierto ? "abierto" : ""}`} id="menuPrincipal">
          <ul className="navbar-nav mx-auto gap-lg-2">
            {ENLACES.map(({ id, texto }) => (
              <li className="nav-item" key={id}>
                <a
                  className={`nav-link ${actual === id ? "activo" : ""}`}
                  href={`#${id}`}
                  onClick={() => setAbierto(false)}
                >
                  {texto}
                </a>
              </li>
            ))}
          </ul>
          <a
            className="btn btn-whatsapp rounded-pill px-4 me-lg-2"
            href={enlaceWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-whatsapp me-2" />
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
