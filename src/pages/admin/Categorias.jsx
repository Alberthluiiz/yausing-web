// =========================================================
// Categorias.jsx (panel) · Sacos, Ponchos, Blusas...
// Si borras una categoría, sus productos quedan "Sin categoría".
// =========================================================
import { useState } from "react";
import Aviso from "../../components/admin/Aviso";
import BotonesFormulario from "../../components/admin/BotonesFormulario";
import Campo from "../../components/admin/Campo";
import FilaAdmin from "../../components/admin/FilaAdmin";
import Interruptor from "../../components/admin/Interruptor";
import Cargando from "../../components/comunes/Cargando";
import Ventana from "../../components/comunes/Ventana";
import { useFormulario } from "../../hooks/useFormulario";
import { useListaAdmin } from "../../hooks/useListaAdmin";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { categorias as tablaCategorias } from "../../supabase/consultas";
import { validarCategoria } from "../../utils/validar";

const VACIO = { nombre: "", orden: 0, activa: true };

// Limpia los datos antes de guardar
const preparar = (datos) => ({ ...datos, nombre: datos.nombre.trim(), orden: Number(datos.orden) || 0 });

function Formulario({ inicial, alGuardar, alCancelar }) {
  const { datos, errores, guardando, cambiar, enviar } = useFormulario(inicial, {
    validar: validarCategoria,
    preparar,
    alGuardar,
    alTerminar: alCancelar,
  });

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="h4 admin-titulo mb-3">{inicial.id ? "Editar categoría" : "Nueva categoría"}</h2>
      <Campo etiqueta="Nombre" nombre="nombre" valor={datos.nombre} alCambiar={cambiar} error={errores.nombre} maxLength={40} ayuda="Ej: Alpargatas" />
      <Interruptor etiqueta="Mostrar en la web" nombre="activa" valor={datos.activa} alCambiar={cambiar} />
      <BotonesFormulario guardando={guardando} alCancelar={alCancelar} />
    </form>
  );
}

export default function Categorias() {
  useTituloPagina("Categorías");
  const lista = useListaAdmin(tablaCategorias);
  const [editando, setEditando] = useState(null);

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 className="admin-titulo">Categorías</h1>
          <p className="text-secondary mb-0">Son los botones para filtrar los productos. Usa las flechas ▲▼ para cambiar el orden.</p>
        </div>
        <button type="button" className="btn btn-rojo rounded-pill px-4" onClick={() => setEditando(VACIO)}>
          <i className="bi bi-plus-lg me-1" /> Nueva categoría
        </button>
      </div>
      <Aviso aviso={lista.aviso} alCerrar={lista.cerrarAviso} />
      <div className="admin-caja">
        {lista.cargando ? (
          <Cargando />
        ) : (
          lista.filas.map((categoria, indice) => (
            <FilaAdmin
              indice={indice}
              total={lista.filas.length}
              alMover={lista.mover}
              key={categoria.id}
              titulo={categoria.nombre}
              detalle="Botón para filtrar productos"
              publicado={categoria.activa}
              alPublicar={() => lista.guardar({ activa: !categoria.activa }, categoria.id)}
              alEditar={() => setEditando(categoria)}
              alBorrar={() =>
                window.confirm(`¿Borrar "${categoria.nombre}"? Sus productos quedarán sin categoría.`) && lista.borrar(categoria.id)
              }
            />
          ))
        )}
      </div>
      {editando && (
        <Ventana titulo="Categoría" alCerrar={() => setEditando(null)}>
          <div className="p-2">
            {lista.aviso?.tipo === "error" && <Aviso aviso={lista.aviso} alCerrar={lista.cerrarAviso} />}
            <Formulario inicial={editando} alGuardar={(datos) => lista.guardar(datos, editando.id)} alCancelar={() => setEditando(null)} />
          </div>
        </Ventana>
      )}
    </>
  );
}
