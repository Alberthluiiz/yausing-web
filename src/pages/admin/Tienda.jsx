// =========================================================
// Tienda.jsx (panel) · Datos generales: WhatsApp, dirección,
// horario, mapa, redes sociales y las 2 fotos de la portada
// =========================================================
import { useEffect, useState } from "react";
import Aviso from "../../components/admin/Aviso";
import Campo from "../../components/admin/Campo";
import CampoFoto from "../../components/admin/CampoFoto";
import Cargando from "../../components/comunes/Cargando";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { tienda as tablaTienda } from "../../supabase/consultas";
import { mensajeDeError } from "../../utils/errores";
import { soloNumeros } from "../../utils/seguridad";
import { validarTienda } from "../../utils/validar";

export default function Tienda() {
  useTituloPagina("Datos de la tienda");
  const [datos, setDatos] = useState(null);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    tablaTienda
      .leer()
      // El horario se edita como texto: una línea por renglón
      .then((fila) => setDatos({ ...fila, horario: fila.horario.join("\n") }))
      .catch((e) => setAviso({ tipo: "error", texto: mensajeDeError(e) }));
  }, []);

  const cambiar = (nombre, valor) => setDatos((anterior) => ({ ...anterior, [nombre]: valor }));

  async function guardar(evento) {
    evento.preventDefault();
    const encontrados = validarTienda(datos);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) {
      setAviso({ tipo: "error", texto: "Revisa los campos marcados en rojo." });
      return;
    }
    setGuardando(true);
    try {
      const limpio = (texto) => (texto ?? "").trim();
      const guardado = await tablaTienda.editar({
        ...datos,
        nombre: limpio(datos.nombre),
        whatsapp: soloNumeros(datos.whatsapp),
        telefono_visible: limpio(datos.telefono_visible),
        direccion: limpio(datos.direccion),
        referencia: limpio(datos.referencia) || null,
        horario: datos.horario.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 7),
        mapa_url: limpio(datos.mapa_url) || null,
        facebook: limpio(datos.facebook),
        instagram: limpio(datos.instagram),
        tiktok: limpio(datos.tiktok),
        burbuja1_titulo: limpio(datos.burbuja1_titulo),
        burbuja1_texto: limpio(datos.burbuja1_texto),
        burbuja2_titulo: limpio(datos.burbuja2_titulo),
        burbuja2_texto: limpio(datos.burbuja2_texto),
      });
      setDatos({ ...guardado, horario: guardado.horario.join("\n") });
      setAviso({ tipo: "ok", texto: "¡Listo! Los datos de la tienda se guardaron." });
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    } finally {
      setGuardando(false);
    }
  }

  if (!datos) return aviso ? <Aviso aviso={aviso} alCerrar={() => setAviso(null)} /> : <Cargando />;

  return (
    <form onSubmit={guardar} noValidate>
      <h1 className="admin-titulo">Datos de la tienda</h1>
      <p className="text-secondary">Esto se ve en la portada, en Contacto y en todos los botones de WhatsApp.</p>
      <Aviso aviso={aviso} alCerrar={() => setAviso(null)} />

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="admin-caja h-100">
            <h2 className="h5 mb-3">Contacto</h2>
            <Campo etiqueta="Nombre de la tienda" nombre="nombre" valor={datos.nombre} alCambiar={cambiar} error={errores.nombre} maxLength={80} />
            <Campo
              etiqueta="Número de WhatsApp"
              nombre="whatsapp"
              valor={datos.whatsapp}
              alCambiar={cambiar}
              error={errores.whatsapp}
              inputMode="numeric"
              maxLength={15}
              ayuda="Con 593 al inicio y sin el primer 0. Ej: 593961380728"
            />
            <Campo etiqueta="Teléfono que se ve en la web" nombre="telefono_visible" valor={datos.telefono_visible} alCambiar={cambiar} error={errores.telefono_visible} maxLength={30} ayuda="Ej: 096 138 0728" />
            <Campo etiqueta="Dirección" nombre="direccion" valor={datos.direccion} alCambiar={cambiar} error={errores.direccion} maxLength={150} />
            <Campo etiqueta="Referencia" nombre="referencia" valor={datos.referencia} alCambiar={cambiar} maxLength={150} ayuda="Ej: Cerca de Servientrega · Quito" />
            <Campo
              etiqueta="Horario"
              nombre="horario"
              tipo="textarea"
              valor={datos.horario}
              alCambiar={cambiar}
              ayuda="Un horario por renglón. Ej: Lunes a sábado · 9:00 a 18:00"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="admin-caja mb-4">
            <h2 className="h5 mb-3">Portada (arriba de la web)</h2>
            <div className="row">
              <div className="col-sm-6">
                <CampoFoto etiqueta="Foto grande" ruta={datos.foto_portada_grande} nombreBase="portada-grande" alCambiar={(r) => cambiar("foto_portada_grande", r)} />
              </div>
              <div className="col-sm-6">
                <CampoFoto etiqueta="Foto pequeña" ruta={datos.foto_portada_chica} nombreBase="portada-chica" alCambiar={(r) => cambiar("foto_portada_chica", r)} />
              </div>
            </div>
            <h3 className="h6 mt-2">Cuadritos sobre las fotos</h3>
            <p className="small text-secondary">El de arriba (con estrellas) y el de abajo (con el pin de ubicación).</p>
            <div className="row">
              <div className="col-sm-6">
                <Campo etiqueta="Cuadrito 1 · título" nombre="burbuja1_titulo" valor={datos.burbuja1_titulo} alCambiar={cambiar} error={errores.burbuja1_titulo} maxLength={40} ayuda="Ej: Nueva temporada" />
                <Campo etiqueta="Cuadrito 1 · texto" nombre="burbuja1_texto" valor={datos.burbuja1_texto} alCambiar={cambiar} error={errores.burbuja1_texto} maxLength={40} ayuda="Ej: Bordados y tejidos" />
              </div>
              <div className="col-sm-6">
                <Campo etiqueta="Cuadrito 2 · título" nombre="burbuja2_titulo" valor={datos.burbuja2_titulo} alCambiar={cambiar} error={errores.burbuja2_titulo} maxLength={40} ayuda="Ej: C.C. Ipiales del Sur" />
                <Campo etiqueta="Cuadrito 2 · texto" nombre="burbuja2_texto" valor={datos.burbuja2_texto} alCambiar={cambiar} error={errores.burbuja2_texto} maxLength={40} ayuda="Ej: Local 67" />
              </div>
            </div>
          </div>
          <div className="admin-caja">
            <h2 className="h5 mb-3">Mapa y redes sociales</h2>
            <Campo
              etiqueta="Enlace del mapa (Google Maps)"
              nombre="mapa_url"
              valor={datos.mapa_url}
              alCambiar={cambiar}
              error={errores.mapa_url}
              ayuda="En Google Maps: Compartir → Insertar un mapa → copia solo lo que está dentro de src=&quot;...&quot;"
            />
            <Campo etiqueta="Facebook" nombre="facebook" valor={datos.facebook} alCambiar={cambiar} error={errores.facebook} placeholder="https://facebook.com/..." />
            <Campo etiqueta="Instagram" nombre="instagram" valor={datos.instagram} alCambiar={cambiar} error={errores.instagram} placeholder="https://instagram.com/..." />
            <Campo etiqueta="TikTok" nombre="tiktok" valor={datos.tiktok} alCambiar={cambiar} error={errores.tiktok} placeholder="https://tiktok.com/@..." />
          </div>
        </div>
      </div>

      <div className="text-end mt-4">
        <button type="submit" className="btn btn-rojo btn-lg rounded-pill px-5" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
