// =========================================================
// CampoFoto.jsx · Elegir y subir una foto desde el panel
// La foto se achica, se pasa a WEBP y se sube al depósito "fotos".
// Devuelve la ruta (ej: productos/1731...-saco.webp) con alCambiar.
// =========================================================
import { useState } from "react";
import Foto from "../comunes/Foto";
import { subirFoto } from "../../supabase/fotos";
import { TIPOS_FOTO, MAXIMO_MB_FOTO } from "../../utils/constantes";
import { mensajeDeError } from "../../utils/errores";

export default function CampoFoto({ ruta, nombreBase, alCambiar, etiqueta = "Foto" }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function alElegir(evento) {
    const archivo = evento.target.files?.[0];
    evento.target.value = ""; // permite elegir la misma foto otra vez
    if (!archivo) return;
    setError("");
    setSubiendo(true);
    try {
      alCambiar(await subirFoto(archivo, nombreBase));
    } catch (e) {
      setError(e.message?.startsWith("Solo") || e.message?.startsWith("La foto") ? e.message : mensajeDeError(e));
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{etiqueta}</label>
      <div className="campo-foto">
        <Foto ruta={ruta} alt="Vista previa" perezosa={false} />
        <div>
          <label className="btn btn-outline-dark rounded-pill">
            {subiendo ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Subiendo...
              </>
            ) : (
              <>
                <i className="bi bi-camera me-2" />
                {ruta ? "Cambiar foto" : "Subir foto"}
              </>
            )}
            <input type="file" accept={TIPOS_FOTO.join(",")} hidden disabled={subiendo} onChange={alElegir} />
          </label>
          <div className="form-text">JPG, PNG o WEBP · máximo {MAXIMO_MB_FOTO} MB.</div>
          {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
      </div>
    </div>
  );
}
