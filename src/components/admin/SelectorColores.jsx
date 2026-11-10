// =========================================================
// SelectorColores.jsx · Elegir los colores de un producto
// - Toca un circulito de la paleta para agregarlo o quitarlo
// - "Otro color": escribe el nombre, elige el tono y toca Agregar
// =========================================================
import { useState } from "react";
import Circulo from "../comunes/Circulo";
import { PALETA, guardarColor, leerColor } from "../../utils/colores";

const MAXIMO = 12;

export default function SelectorColores({ valor = [], alCambiar }) {
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [hexNuevo, setHexNuevo] = useState("#a71916");

  const nombres = valor.map((v) => leerColor(v).nombre.toLowerCase());
  const tiene = (nombre) => nombres.includes(nombre.toLowerCase());

  function alternar(color) {
    if (tiene(color.nombre)) alCambiar(valor.filter((v) => leerColor(v).nombre.toLowerCase() !== color.nombre.toLowerCase()));
    else if (valor.length < MAXIMO) alCambiar([...valor, color.nombre]);
  }

  function agregarPropio() {
    const nombre = nombreNuevo.trim();
    if (!nombre || tiene(nombre) || valor.length >= MAXIMO) return;
    alCambiar([...valor, guardarColor({ nombre, hex: hexNuevo })]);
    setNombreNuevo("");
  }

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold d-block">Colores</label>

      {/* Colores elegidos (tocar uno lo quita) */}
      <div className="d-flex flex-wrap gap-2 mb-2">
        {valor.length === 0 && <small className="text-secondary">Ninguno. Toca los colores de abajo.</small>}
        {valor.map((v) => (
          <button
            key={v}
            type="button"
            className="btn btn-sm btn-light rounded-pill d-inline-flex align-items-center gap-1"
            onClick={() => alCambiar(valor.filter((x) => x !== v))}
            title="Quitar"
          >
            <Circulo valor={v} tamano={16} /> {leerColor(v).nombre} <i className="bi bi-x" />
          </button>
        ))}
      </div>

      {/* Paleta */}
      <div className="d-flex flex-wrap gap-1 p-2 rounded-3 bg-light">
        {PALETA.map((color) => (
          <button
            key={color.nombre}
            type="button"
            className={`opcion-color ${tiene(color.nombre) ? "activo" : ""}`}
            onClick={() => alternar(color)}
            title={color.nombre}
            aria-label={color.nombre}
            aria-pressed={tiene(color.nombre)}
          >
            <Circulo valor={color.nombre} tamano={26} />
          </button>
        ))}
      </div>

      {/* Color propio */}
      <div className="input-group input-group-sm mt-2">
        <input
          type="color"
          className="form-control form-control-color"
          value={hexNuevo}
          onChange={(e) => setHexNuevo(e.target.value)}
          aria-label="Tono del color"
        />
        <input
          type="text"
          className="form-control"
          placeholder="Otro color (ej: Turquesa)"
          maxLength={20}
          value={nombreNuevo}
          onChange={(e) => setNombreNuevo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarPropio())}
        />
        <button type="button" className="btn btn-outline-dark" onClick={agregarPropio}>
          Agregar
        </button>
      </div>
      <div className="form-text">Máximo {MAXIMO} colores. El cliente verá los circulitos y elegirá uno.</div>
    </div>
  );
}
