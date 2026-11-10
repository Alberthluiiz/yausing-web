// =========================================================
// Fotos.jsx (panel) · Todas las fotos guardadas en Supabase
//
// - "Subir varias fotos" las sube SIN cambiarles el nombre.
//   Sirve para pasar de una vez las fotos que ya tenías
//   (carpeta img/productos de la web anterior).
// - Se puede copiar el nombre o borrar una foto que ya no se usa.
// =========================================================
import { useCallback, useEffect, useState } from "react";
import Aviso from "../../components/admin/Aviso";
import Cargando from "../../components/comunes/Cargando";
import Foto from "../../components/comunes/Foto";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { borrarFoto, listarFotos, subirFotoConSuNombre } from "../../supabase/fotos";
import { TIPOS_FOTO } from "../../utils/constantes";
import { mensajeDeError } from "../../utils/errores";

export default function Fotos() {
  useTituloPagina("Fotos");
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [progreso, setProgreso] = useState(null); // { hechas, total }
  const [aviso, setAviso] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setFotos(await listarFotos());
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function subirVarias(evento) {
    const archivos = Array.from(evento.target.files ?? []).slice(0, 60);
    evento.target.value = "";
    if (!archivos.length) return;

    const fallidas = [];
    setProgreso({ hechas: 0, total: archivos.length });
    // Una por una, para no saturar la conexión
    for (const [indice, archivo] of archivos.entries()) {
      try {
        await subirFotoConSuNombre(archivo);
      } catch {
        fallidas.push(archivo.name);
      }
      setProgreso({ hechas: indice + 1, total: archivos.length });
    }
    setProgreso(null);
    setAviso(
      fallidas.length
        ? { tipo: "error", texto: `No se pudieron subir: ${fallidas.join(", ")} (revisa que sean JPG, PNG o WEBP de menos de 5 MB).` }
        : { tipo: "ok", texto: `¡Listo! Se subieron ${archivos.length} foto(s).` },
    );
    cargar();
  }

  async function quitar(foto) {
    if (!window.confirm(`¿Borrar "${foto.nombre}"? Si un producto la usa, se verá el logo en su lugar.`)) return;
    try {
      await borrarFoto(foto.ruta);
      setAviso({ tipo: "ok", texto: "Foto borrada." });
      cargar();
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 className="admin-titulo">Fotos</h1>
          <p className="text-secondary mb-0">{fotos.length} foto(s) guardadas.</p>
        </div>
        <label className={`btn btn-rojo rounded-pill px-4 ${progreso ? "disabled" : ""}`}>
          {progreso ? (
            `Subiendo ${progreso.hechas} de ${progreso.total}...`
          ) : (
            <>
              <i className="bi bi-cloud-arrow-up me-1" /> Subir varias fotos
            </>
          )}
          <input type="file" accept={TIPOS_FOTO.join(",")} multiple hidden disabled={Boolean(progreso)} onChange={subirVarias} />
        </label>
      </div>
      <Aviso aviso={aviso} alCerrar={() => setAviso(null)} />

      <div className="admin-caja">
        {cargando ? (
          <Cargando />
        ) : fotos.length === 0 ? (
          <p className="text-secondary mb-0">Aún no hay fotos. Sube las fotos de la carpeta img/productos.</p>
        ) : (
          <div className="rejilla-fotos">
            {fotos.map((foto) => (
              <figure key={foto.ruta}>
                <Foto ruta={foto.ruta} alt={foto.nombre} />
                <figcaption className="d-flex align-items-start justify-content-between gap-1">
                  <span>
                    {foto.nombre}
                    <br />
                    <span className="text-secondary">{foto.pesoKb} KB</span>
                  </span>
                  <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => quitar(foto)} aria-label={`Borrar ${foto.nombre}`}>
                    <i className="bi bi-trash3" />
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
