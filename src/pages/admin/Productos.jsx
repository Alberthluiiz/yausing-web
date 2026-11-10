// =========================================================
// Productos.jsx (panel) · Agregar, editar, esconder y borrar productos
// =========================================================
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Aviso from "../../components/admin/Aviso";
import Campo from "../../components/admin/Campo";
import CampoFoto from "../../components/admin/CampoFoto";
import FilaAdmin from "../../components/admin/FilaAdmin";
import Interruptor from "../../components/admin/Interruptor";
import SelectorColores from "../../components/admin/SelectorColores";
import SelectorTallas from "../../components/admin/SelectorTallas";
import Cargando from "../../components/comunes/Cargando";
import Ventana from "../../components/comunes/Ventana";
import { useListaAdmin } from "../../hooks/useListaAdmin";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { categorias as tablaCategorias, productos as tablaProductos } from "../../supabase/consultas";
import { precioTexto } from "../../utils/formato";
import { precioDesde, precioVariable } from "../../utils/tallas";
import { validarProducto } from "../../utils/validar";

// Cómo empieza un producto nuevo
const VACIO = {
  nombre: "",
  categoria_id: "",
  descripcion: "",
  precio: "",
  foto_ruta: null,
  tallas: [],
  colores: [],
  destacado: false,
  agotado: false,
  publicado: true,
  orden: 0,
};

function Formulario({ inicial, categorias, alGuardar, alCancelar }) {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const cambiar = (nombre, valor) => setDatos((anterior) => ({ ...anterior, [nombre]: valor }));

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarProducto(datos);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;

    setGuardando(true);
    const listo = await alGuardar({
      ...datos,
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion?.trim() || null,
      precio: Number(datos.precio),
      categoria_id: Number(datos.categoria_id),
      tallas: datos.tallas.filter((t) => t.split(":")[0].trim()).slice(0, 12), // quita tallas sin nombre
      colores: datos.colores.slice(0, 12),
      orden: Number(datos.orden) || 0,
    });
    setGuardando(false);
    if (listo) alCancelar();
  }

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="h4 admin-titulo mb-3">{inicial.id ? "Editar producto" : "Nuevo producto"}</h2>
      <div className="row">
        <div className="col-md-6">
          <CampoFoto ruta={datos.foto_ruta} nombreBase={datos.nombre} alCambiar={(ruta) => cambiar("foto_ruta", ruta)} />
          <Campo etiqueta="Nombre" nombre="nombre" valor={datos.nombre} alCambiar={cambiar} error={errores.nombre} maxLength={80} />
          <Campo
            etiqueta="Categoría"
            nombre="categoria_id"
            tipo="select"
            valor={datos.categoria_id}
            alCambiar={cambiar}
            error={errores.categoria_id}
            opciones={[{ valor: "", texto: "— Elige —" }, ...categorias.map((c) => ({ valor: c.id, texto: c.nombre }))]}
          />
          <Campo
            etiqueta="Precio ($)"
            ayuda="Precio normal. Si una talla cuesta distinto, ponlo en Tallas y precios."
            nombre="precio"
            tipo="number"
            valor={datos.precio}
            alCambiar={cambiar}
            error={errores.precio}
            min="0"
            max="10000"
            step="0.01"
            inputMode="decimal"
          />
        </div>
        <div className="col-md-6">
          <Campo
            etiqueta="Descripción"
            nombre="descripcion"
            tipo="textarea"
            valor={datos.descripcion}
            alCambiar={cambiar}
            error={errores.descripcion}
            maxLength={300}
            ayuda="Corta y clara. Ej: Blusa bordada a mano con mullos."
          />
          <SelectorTallas valor={datos.tallas} alCambiar={(lista) => cambiar("tallas", lista)} />
          {errores.tallas && <p className="text-danger small mt-n2">{errores.tallas}</p>}
          <SelectorColores valor={datos.colores} alCambiar={(lista) => cambiar("colores", lista)} />
          <Interruptor etiqueta="Mostrar en la web" nombre="publicado" valor={datos.publicado} alCambiar={cambiar} />
          <Interruptor etiqueta="★ Destacado (sale primero)" nombre="destacado" valor={datos.destacado} alCambiar={cambiar} />
          <Interruptor etiqueta="Agotado (se ve en gris y al final)" nombre="agotado" valor={datos.agotado} alCambiar={cambiar} />
        </div>
      </div>
      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-light rounded-pill px-4" onClick={alCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-rojo rounded-pill px-4" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

export default function Productos() {
  useTituloPagina("Productos");
  const lista = useListaAdmin(tablaProductos);
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(null); // producto abierto en el formulario
  const [buscar, setBuscar] = useState("");
  const [parametros, setParametros] = useSearchParams();

  useEffect(() => {
    tablaCategorias.listar().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  // Si llega con ?nuevo=1 (desde el inicio del panel), abre el formulario vacío
  useEffect(() => {
    if (parametros.get("nuevo")) {
      setEditando(VACIO);
      setParametros({}, { replace: true });
    }
  }, [parametros, setParametros]);

  const nombreCategoria = useMemo(() => Object.fromEntries(categorias.map((c) => [c.id, c.nombre])), [categorias]);
  const visibles = lista.filas.filter((p) => p.nombre.toLowerCase().includes(buscar.trim().toLowerCase()));

  function abrirEditar(producto) {
    setEditando({
      ...producto,
      descripcion: producto.descripcion ?? "",
      tallas: [...producto.tallas],
      colores: [...producto.colores],
    });
  }

  function confirmarBorrar(producto) {
    if (window.confirm(`¿Seguro que quieres borrar "${producto.nombre}"? No se puede deshacer.`)) {
      lista.borrar(producto.id);
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 className="admin-titulo">Productos</h1>
          <p className="text-secondary mb-0">Toca el ojo para esconder un producto sin borrarlo. Usa las flechas ▲▼ (o arrastra) para cambiar el orden.</p>
        </div>
        <button type="button" className="btn btn-rojo rounded-pill px-4" onClick={() => setEditando(VACIO)}>
          <i className="bi bi-plus-lg me-1" /> Agregar producto
        </button>
      </div>

      <Aviso aviso={lista.aviso} alCerrar={() => lista.setAviso(null)} />

      <div className="admin-caja">
        <input
          type="search"
          className="form-control mb-3"
          placeholder="Buscar por nombre..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          aria-label="Buscar producto"
        />
        {lista.cargando ? (
          <Cargando />
        ) : visibles.length === 0 ? (
          <p className="text-secondary mb-0">No hay productos.</p>
        ) : (
          visibles.map((producto, indice) => (
            <FilaAdmin
              indice={indice}
              total={visibles.length}
              alMover={buscar.trim() ? undefined : lista.mover /* al buscar no se ordena */}
              key={producto.id}
              foto={producto.foto_ruta}
              titulo={`${producto.destacado ? "★ " : ""}${producto.nombre}`}
              detalle={`${precioVariable(producto) ? "Desde " : ""}${precioTexto(precioDesde(producto))} · ${nombreCategoria[producto.categoria_id] ?? "Sin categoría"}${producto.agotado ? " · AGOTADO" : ""}`}
              extra={
                <button
                  type="button"
                  className={`btn btn-sm ${producto.agotado ? "btn-warning" : "btn-light"}`}
                  onClick={() => lista.guardar({ agotado: !producto.agotado }, producto.id)}
                  title={producto.agotado ? "Marcar como disponible" : "Marcar como agotado"}
                  aria-label={producto.agotado ? "Marcar como disponible" : "Marcar como agotado"}
                  aria-pressed={producto.agotado}
                >
                  <i className="bi bi-box-seam" />
                </button>
              }
              publicado={producto.publicado}
              alPublicar={() => lista.cambiarPublicado(producto)}
              alEditar={() => abrirEditar(producto)}
              alBorrar={() => confirmarBorrar(producto)}
            />
          ))
        )}
      </div>

      {editando && (
        <Ventana titulo="Producto" alCerrar={() => setEditando(null)}>
          <div className="p-2">
            {lista.aviso?.tipo === "error" && <Aviso aviso={lista.aviso} alCerrar={() => lista.setAviso(null)} />}
            <Formulario
              inicial={editando}
              categorias={categorias}
              alGuardar={(datos) => lista.guardar(datos, editando.id)}
              alCancelar={() => setEditando(null)}
            />
          </div>
        </Ventana>
      )}
    </>
  );
}
