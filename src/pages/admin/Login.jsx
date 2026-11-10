// =========================================================
// Login.jsx · Entrada al panel (solo Mary)
//
// SEGURIDAD:
// - Chequeo 2: la contraseña la revisa Supabase (guardada con hash)
// - Chequeo 3: después de 5 errores, espera 5 minutos
// - Chequeo 11: el mensaje de error no da pistas (no dice si el
//   correo existe o no)
// =========================================================
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/img/yausig-logo.svg";
import { useSesion } from "../../hooks/useSesion";
import { useLimiteIntentos } from "../../hooks/useLimiteIntentos";
import { useTituloPagina } from "../../hooks/useTituloPagina";
import { iniciarSesion, esAdministrador, cerrarSesion } from "../../supabase/auth";
import { mensajeDeError } from "../../utils/errores";
import { correoValido } from "../../utils/validar";

export default function Login() {
  useTituloPagina("Entrar al panel");
  const { usuario, esAdmin, cargando } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const limite = useLimiteIntentos();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Si ya está conectada como admin, pasa directo al panel
  if (!cargando && usuario && esAdmin) return <Navigate to="/admin" replace />;

  async function entrar(evento) {
    evento.preventDefault();
    if (limite.bloqueado || enviando) return;

    // Validar antes de enviar (chequeo 6)
    if (!correoValido(correo) || contrasena.length < 6 || contrasena.length > 128) {
      setError("Escribe un correo válido y tu contraseña.");
      return;
    }

    setEnviando(true);
    setError("");
    try {
      const sesion = await iniciarSesion(correo, contrasena);
      // Entró, pero ¿es administradora? Si no, se cierra la sesión
      if (!(await esAdministrador(sesion.user.id))) {
        await cerrarSesion();
        throw new Error("Invalid login credentials");
      }
      limite.reiniciar();
      navegar(ubicacion.state?.desde ?? "/admin", { replace: true });
    } catch (e) {
      limite.registrarFallo();
      setError(mensajeDeError(e, "No se pudo entrar. Inténtalo otra vez."));
    } finally {
      setContrasena(""); // nunca dejamos la contraseña escrita
      setEnviando(false);
    }
  }

  const minutos = Math.floor(limite.segundosRestantes / 60);
  const segundos = String(limite.segundosRestantes % 60).padStart(2, "0");

  return (
    <div className="login">
      <form className="login-caja" onSubmit={entrar} noValidate>
        <img src={logo} alt="Yausig Churikuna" />
        <h1 className="h4 text-center titulo mb-1">Panel de la tienda</h1>
        <p className="text-center text-secondary small mb-4">Solo para administradores</p>

        {error && !limite.bloqueado && <div className="alert alert-danger py-2 small">{error}</div>}
        {limite.bloqueado && (
          <div className="alert alert-warning py-2 small">
            Demasiados intentos. Espera {minutos}:{segundos} para volver a probar.
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="correo" className="form-label fw-semibold">
            Correo
          </label>
          <input
            id="correo"
            type="email"
            className="form-control form-control-lg"
            autoComplete="username"
            maxLength={254}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contrasena" className="form-label fw-semibold">
            Contraseña
          </label>
          <div className="input-group">
            <input
              id="contrasena"
              type={verContrasena ? "text" : "password"}
              className="form-control form-control-lg"
              autoComplete="current-password"
              maxLength={128}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setVerContrasena(!verContrasena)}
              aria-label={verContrasena ? "Ocultar contraseña" : "Ver contraseña"}
            >
              <i className={`bi ${verContrasena ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-rojo btn-lg rounded-pill w-100" disabled={enviando || limite.bloqueado}>
          {enviando ? <span className="spinner-border spinner-border-sm" aria-hidden="true" /> : "Entrar"}
        </button>
        <a href="/" className="d-block text-center small mt-3 text-secondary">
          ← Volver a la tienda
        </a>
      </form>
    </div>
  );
}
