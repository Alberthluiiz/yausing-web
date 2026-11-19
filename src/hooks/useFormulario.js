// =========================================================
// useFormulario.js · Lo que comparten los formularios del panel
// (productos, ofertas, galería y categorías)
//
// Uso:
//   const form = useFormulario(inicial, {
//     validar: validarProducto,           // devuelve { campo: "error" }
//     preparar: (datos) => ({ ...datos }), // limpia antes de guardar
//     alGuardar,                           // devuelve true si salió bien
//     alTerminar: alCancelar,              // cierra la ventana
//   });
//   <form onSubmit={form.enviar}> ... form.datos, form.errores, form.cambiar
// =========================================================
import { useCallback, useState } from "react";

export function useFormulario(inicial, { validar, preparar, alGuardar, alTerminar }) {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cambiar = useCallback((nombre, valor) => setDatos((anterior) => ({ ...anterior, [nombre]: valor })), []);

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validar(datos);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;

    setGuardando(true);
    const listo = await alGuardar(preparar(datos));
    setGuardando(false);
    if (listo) alTerminar();
  }

  return { datos, errores, guardando, cambiar, enviar };
}
