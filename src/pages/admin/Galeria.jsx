// =========================================================
// Galeria.jsx (panel) · Fotos de la sección "Galería"
// =========================================================
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Aviso from "../../components/admin/Aviso";
import Campo from "../../components/admin/Campo";
import CampoFoto from "../../components/admin/CampoFoto";
import FilaAdmin from "../../components/admin/FilaAdmin";
import Interruptor from "../../components/admin/Interruptor";
import Cargando from "../../components/comunes/Cargando";
import Ventana from "../../components/comunes/Ventana";
import { useListaAdmin } from "../../hooks/useListaAdmin";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { galeria as tablaGaleria } from "../../supabase/consultas";
import { validarFotoGaleria } from "../../utils/validar";

const VACIO = { foto_ruta: null, texto: "", tamano: "normal", publicado: true, orden: 0 };
const TAMANOS = [
  { valor: "normal", texto: "Normal (cuadrada)" },
  { valor: "ancha", texto: "Ancha (ocupa 2 espacios a lo ancho)" },
  { valor: "grande", texto: "Grande (ocupa 4 espacios)" },
];

function Formulario({ inicial, alGuardar, alCancelar }) {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const cambiar = (nombre, valor) => setDatos((anterior) => ({ ...anterior, [nombre]: valor }));

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarFotoGaleria(datos);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    setGuardando(true);
    const listo = await alGuardar({ ...datos, texto: datos.texto?.trim() || null, orden: Number(datos.orden) || 0 });
    setGuardando(false);
    if (listo) alCancelar();
  }

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="h4 admin-titulo mb-3">{inicial.id ? "Editar foto" : "Nueva foto"}</h2>
      <CampoFoto ruta={datos.foto_ruta} nombreBase={`galeria-${datos.texto}`} alCambiar={(ruta) => cambiar("foto_ruta", ruta)} />
      {errores.foto_ruta && <p className="text-danger small mt-n2">{errores.foto_ruta}</p>}
      <Campo etiqueta="Texto (aparece al pasar el mouse)" nombre="texto" valor={datos.texto} alCambiar={cambiar} error={errores.texto} maxLength={80} />
      <Campo etiqueta="Tamaño" nombre="tamano" tipo="select" valor={datos.tamano} alCambiar={cambiar} error={errores.tamano} opciones={TAMANOS} />
      <Interruptor etiqueta="Mostrar en la web" nombre="publicado" valor={datos.publicado} alCambiar={cambiar} />
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

export default function Galeria() {
  useTituloPagina("Galería");
  const lista = useListaAdmin(tablaGaleria);
  const [editando, setEditando] = useState(null);
  const [parametros, setParametros] = useSearchParams();

  useEffect(() => {
    if (parametros.get("nuevo")) {
      setEditando(VACIO);
      setParametros({}, { replace: true });
    }
  }, [parametros, setParametros]);

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 className="admin-titulo">Galería</h1>
          <p className="text-secondary mb-0">Fotos del local y de tus prendas. Usa las flechas ▲▼ (o arrastra) para cambiar el orden.</p>
        </div>
        <button type="button" className="btn btn-rojo rounded-pill px-4" onClick={() => setEditando(VACIO)}>
          <i className="bi bi-plus-lg me-1" /> Nueva foto
        </button>
      </div>
      <Aviso aviso={lista.aviso} alCerrar={() => lista.setAviso(null)} />
      <div className="admin-caja">
        {lista.cargando ? (
          <Cargando />
        ) : lista.filas.length === 0 ? (
          <p className="text-secondary mb-0">No hay fotos.</p>
        ) : (
          lista.filas.map((foto, indice) => (
            <FilaAdmin
              indice={indice}
              total={lista.filas.length}
              alMover={lista.mover}
              key={foto.id}
              foto={foto.foto_ruta}
              titulo={foto.texto || "(sin texto)"}
              detalle={`Tamaño: ${foto.tamano}`}
              publicado={foto.publicado}
              alPublicar={() => lista.cambiarPublicado(foto)}
              alEditar={() => setEditando({ ...foto, texto: foto.texto ?? "" })}
              alBorrar={() => window.confirm("¿Quitar esta foto de la galería?") && lista.borrar(foto.id)}
            />
          ))
        )}
      </div>
      {editando && (
        <Ventana titulo="Foto de la galería" alCerrar={() => setEditando(null)}>
          <div className="p-2">
            {lista.aviso?.tipo === "error" && <Aviso aviso={lista.aviso} alCerrar={() => lista.setAviso(null)} />}
            <Formulario inicial={editando} alGuardar={(datos) => lista.guardar(datos, editando.id)} alCancelar={() => setEditando(null)} />
          </div>
        </Ventana>
      )}
    </>
  );
}
