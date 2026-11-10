// Cargando.jsx · Círculo que gira mientras algo carga
export default function Cargando({ texto = "Cargando..." }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-5 text-secondary" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      {texto}
    </div>
  );
}
