// =========================================================
// Galeria.jsx · Fotos del local. Al tocar una, se abre en grande.
//
// La cuadrícula tiene 4 columnas. Si las fotos no llenan la última
// fila, algunas fotos "normales" del final se ponen "anchas" solas,
// para que no quede un hueco (Mary no tiene que calcular nada).
// =========================================================
import { useCallback, useState } from "react";
import Aparecer from "../comunes/Aparecer";
import Etiqueta from "../comunes/Etiqueta";
import Foto from "../comunes/Foto";
import Ventana from "../comunes/Ventana";
import { TAMANOS_GALERIA } from "../../utils/constantes";
import { enlaceWhatsapp, mensajeGaleria } from "../../utils/whatsapp";

const COLUMNAS = 4;
const CELDAS = { normal: 1, ancha: 2, grande: 4 };

// Devuelve el tamaño de cada foto, ya ajustado para que no queden huecos
function tamanosSinHuecos(fotos) {
  const tamanos = fotos.map((item) => (TAMANOS_GALERIA.includes(item.tamano) ? item.tamano : "normal"));
  const usadas = tamanos.reduce((total, tamano) => total + CELDAS[tamano], 0);
  let faltan = (COLUMNAS - (usadas % COLUMNAS)) % COLUMNAS;
  for (let i = tamanos.length - 1; i >= 0 && faltan > 0; i -= 1) {
    if (tamanos[i] === "normal") {
      tamanos[i] = "ancha"; // ocupa 1 celda más
      faltan -= 1;
    }
  }
  return tamanos;
}

export default function Galeria({ tienda, fotos }) {
  const [abierta, setAbierta] = useState(null); // número de la foto abierta, o null
  const cerrar = useCallback(() => setAbierta(null), []);

  if (fotos.length === 0) return null;

  const mover = (paso) => setAbierta((actual) => (actual + paso + fotos.length) % fotos.length);
  const foto = abierta !== null ? fotos[abierta] : null;
  const tamanos = tamanosSinHuecos(fotos);

  return (
    <section id="galeria" className="seccion seccion-hueso">
      <div className="container">
        <Aparecer className="encabezado">
          <Etiqueta>Galería</Etiqueta>
          <h2 className="titulo display-6">
            Conoce nuestro <em>local</em>
          </h2>
          <p className="texto-suave">Toca una foto para verla en grande.</p>
        </Aparecer>

        <div className="galeria">
          {fotos.map((item, indice) => {
            const tamano = tamanos[indice];
            return (
              <button
                key={item.id}
                type="button"
                className={`galeria-foto ${tamano}`}
                onClick={() => setAbierta(indice)}
                aria-label={`Ver foto: ${item.texto || "foto del local"}`}
              >
                <Foto ruta={item.foto_ruta} alt={item.texto || "Foto del local"} />
                {item.texto && (
                  <span>
                    <i className="bi bi-zoom-in me-1" />
                    <b>{item.texto}</b>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {foto && (
        <Ventana titulo={foto.texto || "Foto"} alCerrar={cerrar} className="visor">
          <Foto ruta={foto.foto_ruta} alt={foto.texto || "Foto del local"} perezosa={false} />
          {foto.texto && <p className="mb-2">{foto.texto}</p>}
          <div className="text-center">
            <a
              className="btn btn-whatsapp rounded-pill px-4"
              href={enlaceWhatsapp(tienda.whatsapp, mensajeGaleria(tienda.nombre, foto.texto))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-whatsapp me-2" />
              Preguntar por esto
            </a>
          </div>
          {fotos.length > 1 && (
            <>
              <button type="button" className="visor-flecha izquierda" onClick={() => mover(-1)} aria-label="Anterior">
                <i className="bi bi-chevron-left" />
              </button>
              <button type="button" className="visor-flecha derecha" onClick={() => mover(1)} aria-label="Siguiente">
                <i className="bi bi-chevron-right" />
              </button>
            </>
          )}
        </Ventana>
      )}
    </section>
  );
}
