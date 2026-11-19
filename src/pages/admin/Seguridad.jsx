// =========================================================
// Seguridad.jsx (panel) · Verificación en dos pasos
//
// SEGURIDAD (chequeo 3): Mary puede activar un código de 6
// números que cambia cada 30 segundos en su celular (app
// Google Authenticator, Microsoft Authenticator o parecida).
// Con eso activado, para entrar al panel hace falta la
// contraseña Y el celular. La base de datos también lo exige
// (ver supabase/sql/09-endurecer-seguridad.sql).
//
// Si pierde el celular: en Supabase → Authentication → Users →
// su usuario → borrar el "factor" MFA. Luego puede activarlo de nuevo.
// =========================================================
import { useCallback, useEffect, useState } from "react";
import Aviso from "../../components/admin/Aviso";
import Cargando from "../../components/comunes/Cargando";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { codigoActivado, desactivarCodigo, empezarActivacion, terminarActivacion } from "../../supabase/auth";
import { mensajeDeError } from "../../utils/errores";

export default function Seguridad() {
  useTituloPagina("Seguridad");
  const [activo, setActivo] = useState(undefined); // undefined = cargando, null = no tiene
  const [nuevo, setNuevo] = useState(null); // { factorId, qr, clave } mientras activa
  const [codigo, setCodigo] = useState("");
  const [aviso, setAviso] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  const cargar = useCallback(async () => {
    try {
      setActivo(await codigoActivado());
    } catch (e) {
      setActivo(null);
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cerrarAviso = useCallback(() => setAviso(null), []);

  async function empezar() {
    setOcupado(true);
    setAviso(null);
    try {
      setNuevo(await empezarActivacion());
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    } finally {
      setOcupado(false);
    }
  }

  async function confirmar(evento) {
    evento.preventDefault();
    if (!/^\d{6}$/.test(codigo)) {
      setAviso({ tipo: "error", texto: "Escribe los 6 números que muestra tu celular." });
      return;
    }
    setOcupado(true);
    try {
      await terminarActivacion(nuevo.factorId, codigo);
      setNuevo(null);
      setAviso({ tipo: "ok", texto: "¡Listo! Desde ahora, al entrar te pediremos el código del celular." });
      await cargar();
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e, "El código no es correcto. Prueba con el número nuevo.") });
    } finally {
      setCodigo("");
      setOcupado(false);
    }
  }

  async function desactivar() {
    if (!activo) return;
    setOcupado(true);
    try {
      await desactivarCodigo(activo.id);
      setAviso({ tipo: "ok", texto: "Se desactivó el código. Ahora solo se pide la contraseña." });
      await cargar();
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    } finally {
      setOcupado(false);
    }
  }

  if (activo === undefined) return <Cargando />;

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 className="admin-titulo">Seguridad</h1>
      <Aviso aviso={aviso} alCerrar={cerrarAviso} />

      <h2 className="h5 mt-3">Verificación en dos pasos</h2>
      <p className="text-secondary">
        Además de la contraseña, se pide un código de 6 números que cambia cada 30 segundos en tu celular. Así, aunque
        alguien descubra tu contraseña, no puede entrar sin tu celular.
      </p>

      {activo && (
        <>
          <div className="alert alert-success d-flex align-items-center">
            <i className="bi bi-shield-check me-2" />
            Activada en «{activo.friendly_name || "tu celular"}».
          </div>
          <button type="button" className="btn btn-outline-danger rounded-pill" onClick={desactivar} disabled={ocupado}>
            Desactivar el código
          </button>
        </>
      )}

      {!activo && !nuevo && (
        <button type="button" className="btn btn-rojo rounded-pill" onClick={empezar} disabled={ocupado}>
          <i className="bi bi-shield-lock me-1" /> Activar el código del celular
        </button>
      )}

      {!activo && nuevo && (
        <form onSubmit={confirmar} noValidate>
          <ol className="ps-3">
            <li>
              Instala en tu celular <strong>Google Authenticator</strong> o <strong>Microsoft Authenticator</strong>.
            </li>
            <li>En la app, toca «+» y escanea este dibujo:</li>
          </ol>
          <img src={nuevo.qr} alt="Código QR para la app del celular" width={200} height={200} className="d-block mb-2 bg-white p-2" />
          <p className="small text-secondary">
            ¿No puedes escanear? Escribe esta clave en la app: <code className="user-select-all">{nuevo.clave}</code>
          </p>
          <label htmlFor="codigo-nuevo" className="form-label fw-semibold">
            3. Escribe los 6 números que aparecen en la app
          </label>
          <div className="d-flex gap-2">
            <input
              id="codigo-nuevo"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="form-control form-control-lg text-center"
              style={{ maxWidth: 180 }}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
            />
            <button type="submit" className="btn btn-rojo rounded-pill px-4" disabled={ocupado}>
              Confirmar
            </button>
          </div>
        </form>
      )}

      <p className="small text-secondary mt-4">
        Si pierdes el celular, pide a quien hizo la web que borre el código desde Supabase y vuelve a activarlo.
      </p>
    </div>
  );
}
