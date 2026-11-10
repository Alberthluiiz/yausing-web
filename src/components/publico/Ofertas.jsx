// =========================================================
// Ofertas.jsx · Ofertas con cuenta regresiva
// - Cada oferta puede tener su día de fin ("termina_el").
//   Pasado ese día, ya no se muestra. Sin fecha = hasta fin de mes.
// - El reloj cuenta hasta la oferta que termina primero.
// =========================================================
import Aparecer from "../comunes/Aparecer";
import Etiqueta from "../comunes/Etiqueta";
import Foto from "../comunes/Foto";
import Precio from "../comunes/Precio";
import { useCuentaRegresiva } from "../../hooks/useCuentaRegresiva";
import { COLORES_OFERTA } from "../../utils/constantes";
import { porcentajeDescuento, precioTexto } from "../../utils/formato";
import { diaEnTexto, finDeOferta, ofertaVigente } from "../../utils/fechas";
import { enlaceWhatsapp, mensajeOferta } from "../../utils/whatsapp";

const dosCifras = (numero) => String(numero).padStart(2, "0");

function Reloj({ fin, titulo }) {
  const { dias, horas, minutos, segundos } = useCuentaRegresiva(fin);
  const partes = [
    [dias, "días"],
    [horas, "horas"],
    [minutos, "min"],
    [segundos, "seg"],
  ];
  return (
    <div className="reloj">
      <small>{titulo}</small>
      <div className="reloj-numeros">
        {partes.map(([valor, texto]) => (
          <div key={texto}>
            <strong>{dosCifras(valor)}</strong>
            <span>{texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Ofertas({ tienda, ofertas }) {
  // Solo las ofertas que todavía valen
  const vigentes = ofertas.filter((oferta) => ofertaVigente(oferta));
  if (vigentes.length === 0) return null; // si no hay ofertas, la sección no se muestra

  // El reloj cuenta hasta la que termina primero
  const fines = vigentes.map((oferta) => finDeOferta(oferta));
  const primerFin = new Date(Math.min(...fines));
  const conFechaPropia = vigentes.some((oferta) => oferta.termina_el);
  const tituloReloj = vigentes.length > 1 && conFechaPropia ? "La primera oferta termina en" : "La oferta termina en";

  return (
    <section id="ofertas" className="seccion">
      <div className="container">
        <div className="row align-items-end g-4 mb-5">
          <Aparecer className="col-lg-7">
            <Etiqueta>Ofertas</Etiqueta>
            <h2 className="titulo display-6 mb-0">
              Precios <em>especiales</em>{conFechaPropia ? "" : " del mes"}
            </h2>
          </Aparecer>
          <Aparecer className="col-lg-5">
            <Reloj fin={primerFin} titulo={tituloReloj} />
          </Aparecer>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
          {vigentes.map((oferta) => {
            // El color solo puede ser uno de la lista (seguridad)
            const color = COLORES_OFERTA.includes(oferta.color) ? oferta.color : "rojo";
            const descuento = porcentajeDescuento(oferta.precio_antes, oferta.precio_ahora);
            return (
              <Aparecer className="col" key={oferta.id}>
                <article className="oferta" style={{ "--color-oferta": `var(--${color})` }}>
                  <div className="oferta-cabeza">
                    <Foto ruta={oferta.foto_ruta} alt={oferta.nombre} className="oferta-foto" />
                    {descuento > 0 && <span className="oferta-descuento">-{descuento}%</span>}
                  </div>
                  <h3>{oferta.nombre}</h3>
                  {oferta.descripcion && <p>{oferta.descripcion}</p>}
                  {oferta.termina_el && (
                    <small className="oferta-hasta">
                      <i className="bi bi-calendar-event me-1" />
                      Válida hasta el {diaEnTexto(oferta.termina_el)}
                    </small>
                  )}
                  <div className="oferta-precios">
                    <Precio valor={oferta.precio_ahora} />
                    <del>{precioTexto(oferta.precio_antes)}</del>
                  </div>
                  <a
                    className="btn btn-rojo rounded-pill w-100"
                    href={enlaceWhatsapp(tienda.whatsapp, mensajeOferta(tienda.nombre, oferta))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-whatsapp me-2" />
                    La quiero
                  </a>
                </article>
              </Aparecer>
            );
          })}
        </div>
      </div>
    </section>
  );
}
