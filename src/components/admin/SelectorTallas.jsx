// =========================================================
// SelectorTallas.jsx · Tallas de un producto y su precio
//
// Cada talla puede tener su PROPIO precio. Si lo dejas vacío,
// esa talla cuesta lo mismo que el "Precio" del producto.
// En la web se mostrará "Desde $..." cuando el precio cambie.
// =========================================================
import { useState } from "react";
import { guardarTalla, leerTalla } from "../../utils/tallas";

const MAXIMO = 12;

// Botones para agregar varias tallas de una vez
const GRUPOS = [
  { texto: "S · M · L · XL", tallas: ["S", "M", "L", "XL"] },
  { texto: "28 · 30 · 32 · 34", tallas: ["28", "30", "32", "34"] },
  { texto: "Única", tallas: ["Única"] },
];

export default function SelectorTallas({ valor = [], alCambiar }) {
  // Se guarda lo que se escribe tal cual (ej: "15.") para no cortar los decimales mientras escribes
  const [filas, setFilas] = useState(() => valor.map((v) => ({ ...leerTalla(v), precio: leerTalla(v).precio ?? "" })));

  const actualizar = (nuevas) => {
    const lista = nuevas.slice(0, MAXIMO);
    setFilas(lista);
    alCambiar(lista.map(guardarTalla));
  };
  const cambiarFila = (indice, campo, dato) =>
    actualizar(filas.map((fila, i) => (i === indice ? { ...fila, [campo]: dato } : fila)));
  const quitar = (indice) => actualizar(filas.filter((_, i) => i !== indice));
  const agregarGrupo = (tallas) => {
    const existentes = filas.map((f) => f.nombre.toLowerCase());
    const nuevas = tallas.filter((t) => !existentes.includes(t.toLowerCase())).map((nombre) => ({ nombre, precio: "" }));
    actualizar([...filas, ...nuevas]);
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold d-block">Tallas y precios</label>

      {filas.length === 0 && <p className="small text-secondary mb-2">Sin tallas (ej: collares, cintas).</p>}
      {filas.map((fila, indice) => (
        <div className="input-group input-group-sm mb-1" key={indice}>
          <input
            type="text"
            className="form-control"
            placeholder="Talla"
            maxLength={15}
            value={fila.nombre}
            onChange={(e) => cambiarFila(indice, "nombre", e.target.value)}
            aria-label="Talla"
          />
          <span className="input-group-text">$</span>
          <input
            type="number"
            className="form-control"
            placeholder="Mismo precio"
            min="0"
            max="10000"
            step="0.01"
            inputMode="decimal"
            value={fila.precio}
            onChange={(e) => cambiarFila(indice, "precio", e.target.value)}
            aria-label={`Precio de la talla ${fila.nombre}`}
          />
          <button type="button" className="btn btn-outline-danger" onClick={() => quitar(indice)} aria-label="Quitar talla">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      ))}

      <div className="d-flex flex-wrap gap-1 mt-2">
        <button type="button" className="btn btn-sm btn-outline-dark rounded-pill" onClick={() => actualizar([...filas, { nombre: "", precio: "" }])}>
          <i className="bi bi-plus" /> Talla
        </button>
        {GRUPOS.map((grupo) => (
          <button key={grupo.texto} type="button" className="btn btn-sm btn-light rounded-pill" onClick={() => agregarGrupo(grupo.tallas)}>
            + {grupo.texto}
          </button>
        ))}
      </div>
      <div className="form-text">Deja el precio vacío si esa talla cuesta igual que el precio del producto.</div>
    </div>
  );
}
