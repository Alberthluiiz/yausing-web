// =========================================================
// Contacto.jsx · Dirección, horario, WhatsApp, redes y mapa
// Todos los datos se cambian desde el panel → "Datos de la tienda"
// =========================================================
import Aparecer from "../comunes/Aparecer";
import Etiqueta from "../comunes/Etiqueta";
import { enlaceSeguro, mapaSeguro } from "../../utils/seguridad";
import { enlaceWhatsapp, mensajeVisita } from "../../utils/whatsapp";

const REDES = [
  { clave: "facebook", icono: "bi-facebook", nombre: "Facebook" },
  { clave: "instagram", icono: "bi-instagram", nombre: "Instagram" },
  { clave: "tiktok", icono: "bi-tiktok", nombre: "TikTok" },
];

export default function Contacto({ tienda }) {
  const mapa = mapaSeguro(tienda.mapa_url);
  // Solo se muestran las redes que tienen un enlace https válido
  const redes = REDES.map((red) => ({ ...red, enlace: enlaceSeguro(tienda[red.clave]) })).filter((red) => red.enlace);

  return (
    <section id="contacto" className="seccion">
      <div className="container">
        <Aparecer className="encabezado">
          <Etiqueta>Contacto</Etiqueta>
          <h2 className="titulo display-6">
            Te esperamos en el <em>local</em>
          </h2>
        </Aparecer>

        <div className="row g-4 align-items-stretch">
          <Aparecer className="col-lg-5">
            <div className="contacto-tarjeta">
              <div className="dato">
                <span className="dato-icono icono-rojo">
                  <i className="bi bi-geo-alt-fill" />
                </span>
                <div>
                  <small>Dirección</small>
                  <p>
                    {tienda.direccion}
                    {tienda.referencia && (
                      <>
                        <br />
                        {tienda.referencia}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="dato">
                <span className="dato-icono icono-amarillo">
                  <i className="bi bi-clock-fill" />
                </span>
                <div>
                  <small>Horario</small>
                  {tienda.horario.map((linea) => (
                    <p key={linea}>{linea}</p>
                  ))}
                </div>
              </div>
              <div className="dato">
                <span className="dato-icono icono-verde">
                  <i className="bi bi-whatsapp" />
                </span>
                <div>
                  <small>WhatsApp</small>
                  <p>{tienda.telefono_visible}</p>
                </div>
              </div>

              <a
                href={enlaceWhatsapp(tienda.whatsapp, mensajeVisita(tienda.nombre, tienda.direccion))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg rounded-pill w-100 mt-2"
              >
                <i className="bi bi-whatsapp me-2" />
                Escríbenos por WhatsApp
              </a>

              <div className="redes">
                <small>{redes.length > 0 ? "Síguenos" : "Redes sociales muy pronto"}</small>
                <div>
                  {redes.map((red) => (
                    <a key={red.clave} href={red.enlace} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}>
                      <i className={`bi ${red.icono}`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Aparecer>

          <Aparecer className="col-lg-7">
            <div className="mapa">
              {mapa && (
                <iframe
                  src={mapa}
                  title={`Mapa de ${tienda.direccion}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
              {/* Dibujo que se ve mientras carga el mapa */}
              <div className="mapa-dibujo" aria-hidden="true">
                <span className="mapa-pin">
                  <i className="bi bi-geo-alt-fill" />
                </span>
                <strong>{tienda.direccion}</strong>
              </div>
            </div>
          </Aparecer>
        </div>
      </div>
    </section>
  );
}
