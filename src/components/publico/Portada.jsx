// =========================================================
// Portada.jsx · Primera sección (Inicio)
//
// Diseño: una tarjeta grande con esquinas redondeadas.
//   - Izquierda: textos y botones.
//   - Derecha: las fotos de portada, que se van turnando solas
//     (cada 6 segundos) y se funden con el fondo. Encima: el logo
//     flotando y los 2 cuadritos.
//   - Abajo: la tarjeta blanca de beneficios, montada sobre la portada.
//
// Las 2 fotos y los 2 cuadritos se cambian desde el panel → "Datos de la tienda".
// =========================================================
import { useEffect, useState } from "react";
import Aparecer from "../comunes/Aparecer";
import Etiqueta from "../comunes/Etiqueta";
import Foto from "../comunes/Foto";
import Beneficios from "./Beneficios";
import icono from "../../assets/img/yausig-icono.svg";

const SEGUNDOS_POR_FOTO = 6;

// ¿La persona pidió "menos movimiento" en su equipo?
const menosMovimiento = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function Portada({ tienda, enlaceWhatsapp }) {
  // Fotos que existen (si falta una, se muestra solo la otra)
  const fotos = [tienda.foto_portada_grande, tienda.foto_portada_chica].filter(Boolean);
  const [actual, setActual] = useState(0);

  // Cambia de foto sola cada pocos segundos
  useEffect(() => {
    if (fotos.length < 2 || menosMovimiento()) return undefined;
    const id = setInterval(() => setActual((n) => (n + 1) % fotos.length), SEGUNDOS_POR_FOTO * 1000);
    return () => clearInterval(id);
  }, [fotos.length, actual]); // "actual": si tocan un puntito, el tiempo vuelve a empezar

  return (
    <section id="inicio" className="portada">
      <div className="container">
        <div className="portada-tarjeta">
          {/* Fotos (derecha) */}
          <div className="portada-fotos">
            {fotos.map((ruta, indice) => (
              <div key={ruta} className={`portada-foto ${indice === actual ? "activa" : ""}`} aria-hidden={indice !== actual}>
                <Foto ruta={ruta} alt={indice === 0 ? "Prendas de Yausig Churikuna" : ""} perezosa={indice !== 0} />
              </div>
            ))}

            {/* Logo flotando */}
            <img src={icono} alt="" className="portada-icono" />

            <div className="burbuja burbuja-arriba">
              <i className="bi bi-stars" />
              <div>
                <strong>{tienda.burbuja1_titulo}</strong>
                <small>{tienda.burbuja1_texto}</small>
              </div>
            </div>
            <div className="burbuja burbuja-abajo">
              <i className="bi bi-geo-alt-fill" />
              <div>
                <strong>{tienda.burbuja2_titulo}</strong>
                <small>{tienda.burbuja2_texto}</small>
              </div>
            </div>
          </div>

          {/* Textos (izquierda) */}
          <Aparecer className="portada-contenido">
            <Etiqueta>Ropa indígena · Quito</Etiqueta>
            <h1 className="titulo portada-titulo">
              Vestimos tu identidad con <em>orgullo</em>
            </h1>
            <p className="portada-texto">
              Blusas bordadas, sacos, ponchos, fajas y collares, elegidos con cariño por Mary para toda la
              familia.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <a href="#productos" className="btn btn-rojo rounded-pill px-4 py-3">
                Ver productos <i className="bi bi-arrow-right ms-2" />
              </a>
              <a
                href={enlaceWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-blanco rounded-pill px-4 py-3"
              >
                <i className="bi bi-whatsapp me-2" />
                Escríbenos
              </a>
            </div>

            {/* Puntitos para cambiar de foto */}
            {fotos.length > 1 && (
              <div className="portada-puntos" role="group" aria-label="Fotos de portada">
                {fotos.map((ruta, indice) => (
                  <button
                    key={ruta}
                    type="button"
                    className={indice === actual ? "activo" : ""}
                    aria-label={`Ver foto ${indice + 1}`}
                    aria-pressed={indice === actual}
                    onClick={() => setActual(indice)}
                  />
                ))}
              </div>
            )}
          </Aparecer>
        </div>

        {/* Beneficios montados sobre la portada */}
        <Beneficios />
      </div>
    </section>
  );
}
