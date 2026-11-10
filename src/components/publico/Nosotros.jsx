// Nosotros.jsx · Sección "Nosotros" (los textos se cambian aquí)
import Aparecer from "../comunes/Aparecer";
import Etiqueta from "../comunes/Etiqueta";
import logoVertical from "../../assets/img/yausig-logo-vertical.svg";

const VALORES = [
  { numero: "01", titulo: "Calidad", texto: "Telas y tejidos que duran", color: "valor-rojo" },
  { numero: "02", titulo: "Tradición", texto: "Diseños de nuestra tierra", color: "valor-amarillo" },
  { numero: "03", titulo: "Confianza", texto: "Atención cercana", color: "valor-verde" },
];

export default function Nosotros() {
  return (
    <section id="nosotros" className="seccion">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          <Aparecer className="col-lg-5">
            <div className="nosotros-marco">
              <img src={logoVertical} alt="Logo de Yausig Churikuna" />
            </div>
          </Aparecer>
          <Aparecer className="col-lg-7">
            <Etiqueta>Nosotros</Etiqueta>
            <h2 className="titulo display-6 mb-4">
              Un local familiar con <em>raíces</em> andinas
            </h2>
            <p className="texto-suave">
              Yausig Churikuna es el local de Mary en el sur de Quito. Desde hace años ayudamos a nuestras familias a
              vestir su cultura con prendas tradicionales de buena calidad y a precios justos.
            </p>
            <p className="texto-suave mb-4">
              Te atendemos como en casa: te ayudamos a elegir la talla, el color y la prenda perfecta para el día a
              día o para las fiestas.
            </p>
            <div className="row row-cols-1 row-cols-sm-3 g-3">
              {VALORES.map((valor) => (
                <div className="col" key={valor.numero}>
                  <div className={`valor ${valor.color}`}>
                    <span>{valor.numero}</span>
                    <h3>{valor.titulo}</h3>
                    <small>{valor.texto}</small>
                  </div>
                </div>
              ))}
            </div>
          </Aparecer>
        </div>
      </div>
    </section>
  );
}
