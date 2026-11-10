// =========================================================
// Ofertas.jsx (panel) · Combos y precios especiales del mes
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
import { ofertas as tablaOfertas } from "../../supabase/consultas";
import { COLORES_OFERTA } from "../../utils/constantes";
import { porcentajeDescuento, precioTexto } from "../../utils/formato";
import { diaEnTexto, hoyEnTexto, ofertaVigente } from "../../utils/fechas";
import { validarOferta } from "../../utils/validar";

const VACIO = {
  nombre: "",
  descripcion: "",
  precio_antes: "",
  precio_ahora: "",
  foto_ruta: null,
  color: "rojo",
  termina_el: "",
  publicado: true,
  orden: 0,
};

// Texto de la fila: precio y hasta cuándo vale
function detalleOferta(oferta) {
  const precio = `${precioTexto(oferta.precio_ahora)} (antes ${precioTexto(oferta.precio_antes)})`;
  if (!oferta.termina_el) return `${precio} · Hasta fin de mes`;
  if (!ofertaVigente(oferta)) return `${precio} · Terminó el ${diaEnTexto(oferta.termina_el)} (ya no se ve en la web)`;
  return `${precio} · Hasta el ${diaEnTexto(oferta.termina_el)}`;
}

function Formulario({ inicial, alGuardar, alCancelar }) {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const cambiar = (nombre, valor) => setDatos((anterior) => ({ ...anterior, [nombre]: valor }));
  const descuento = porcentajeDescuento(datos.precio_antes, datos.precio_ahora);

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarOferta(datos);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    setGuardando(true);
    const listo = await alGuardar({
      ...datos,
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion?.trim() || null,
      precio_antes: Number(datos.precio_antes),
      precio_ahora: Number(datos.precio_ahora),
      termina_el: datos.termina_el || null, // vacío = hasta fin de mes
      orden: Number(datos.orden) || 0,
    });
    setGuardando(false);
    if (listo) alCancelar();
  }

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="h4 admin-titulo mb-3">{inicial.id ? "Editar oferta" : "Nueva oferta"}</h2>
      <CampoFoto ruta={datos.foto_ruta} nombreBase={`oferta-${datos.nombre}`} alCambiar={(ruta) => cambiar("foto_ruta", ruta)} />
      <Campo etiqueta="Nombre" nombre="nombre" valor={datos.nombre} alCambiar={cambiar} error={errores.nombre} maxLength={80} ayuda="Ej: Combo caballero" />
      <Campo etiqueta="Descripción" nombre="descripcion" tipo="textarea" valor={datos.descripcion} alCambiar={cambiar} error={errores.descripcion} maxLength={300} ayuda="Ej: Poncho + camisa cuello militar." />
      <div className="row">
        <div className="col-6">
          <Campo etiqueta="Precio antes ($)" nombre="precio_antes" tipo="number" valor={datos.precio_antes} alCambiar={cambiar} error={errores.precio_antes} min="0" step="0.01" inputMode="decimal" />
        </div>
        <div className="col-6">
          <Campo etiqueta="Precio ahora ($)" nombre="precio_ahora" tipo="number" valor={datos.precio_ahora} alCambiar={cambiar} error={errores.precio_ahora} min="0" step="0.01" inputMode="decimal" />
        </div>
      </div>
      {descuento > 0 && <p className="small text-success mt-n2">El cliente ahorra {descuento}%.</p>}
      <Campo
        etiqueta="La oferta termina el (opcional)"
        nombre="termina_el"
        tipo="date"
        valor={datos.termina_el}
        alCambiar={cambiar}
        error={errores.termina_el}
        min={inicial.id ? undefined : hoyEnTexto()}
        ayuda="Ese día es el último. Al día siguiente la oferta se esconde sola. Si lo dejas vacío, dura hasta fin de mes."
      />
      <Campo
        etiqueta="Color de la tarjeta"
        nombre="color"
        tipo="select"
        valor={datos.color}
        alCambiar={cambiar}
        error={errores.color}
        opciones={COLORES_OFERTA.map((c) => ({ valor: c, texto: c[0].toUpperCase() + c.slice(1) }))}
      />
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

export default function Ofertas() {
  useTituloPagina("Ofertas");
  const lista = useListaAdmin(tablaOfertas);
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
          <h1 className="admin-titulo">Ofertas</h1>
          <p className="text-secondary mb-0">Si escondes todas, la sección de ofertas no aparece en la web. Usa las flechas ▲▼ para cambiar el orden.</p>
        </div>
        <button type="button" className="btn btn-rojo rounded-pill px-4" onClick={() => setEditando(VACIO)}>
          <i className="bi bi-plus-lg me-1" /> Nueva oferta
        </button>
      </div>
      <Aviso aviso={lista.aviso} alCerrar={() => lista.setAviso(null)} />
      <div className="admin-caja">
        {lista.cargando ? (
          <Cargando />
        ) : lista.filas.length === 0 ? (
          <p className="text-secondary mb-0">No hay ofertas.</p>
        ) : (
          lista.filas.map((oferta, indice) => (
            <FilaAdmin
              indice={indice}
              total={lista.filas.length}
              alMover={lista.mover}
              key={oferta.id}
              foto={oferta.foto_ruta}
              titulo={oferta.nombre}
              detalle={detalleOferta(oferta)}
              publicado={oferta.publicado}
              alPublicar={() => lista.cambiarPublicado(oferta)}
              alEditar={() => setEditando({ ...oferta, descripcion: oferta.descripcion ?? "", termina_el: oferta.termina_el ?? "" })}
              alBorrar={() => window.confirm(`¿Borrar la oferta "${oferta.nombre}"?`) && lista.borrar(oferta.id)}
            />
          ))
        )}
      </div>
      {editando && (
        <Ventana titulo="Oferta" alCerrar={() => setEditando(null)}>
          <div className="p-2">
            {lista.aviso?.tipo === "error" && <Aviso aviso={lista.aviso} alCerrar={() => lista.setAviso(null)} />}
            <Formulario inicial={editando} alGuardar={(datos) => lista.guardar(datos, editando.id)} alCancelar={() => setEditando(null)} />
          </div>
        </Ventana>
      )}
    </>
  );
}
