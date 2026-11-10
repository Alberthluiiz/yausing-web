// =========================================================
// useListaAdmin.js · Lo que necesita cada lista del panel:
// cargar, guardar (crear o editar), borrar y mostrar avisos.
//
// Uso:  const lista = useListaAdmin(productos);
//       lista.filas, lista.guardar(datos, id), lista.borrar(id)...
//       lista.mover(desde, hasta) → cambia el orden (flechas o arrastrar)
// =========================================================
import { useCallback, useEffect, useState } from "react";
import { mensajeDeError } from "../utils/errores";

export function useListaAdmin(tabla) {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState(null); // { tipo: "ok" | "error", texto }

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setFilas(await tabla.listar());
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    } finally {
      setCargando(false);
    }
  }, [tabla]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Crea (si no hay id) o edita (si hay id). Devuelve true si salió bien.
  const guardar = useCallback(
    async (datos, id) => {
      try {
        if (id) await tabla.editar(id, datos);
        else await tabla.crear(datos);
        setAviso({ tipo: "ok", texto: "¡Listo! Se guardó correctamente." });
        await cargar();
        return true;
      } catch (e) {
        setAviso({ tipo: "error", texto: mensajeDeError(e) });
        return false;
      }
    },
    [tabla, cargar],
  );

  const borrar = useCallback(
    async (id) => {
      try {
        await tabla.borrar(id);
        setAviso({ tipo: "ok", texto: "Se borró correctamente." });
        await cargar();
      } catch (e) {
        setAviso({ tipo: "error", texto: mensajeDeError(e) });
      }
    },
    [tabla, cargar],
  );

  // Mostrar u ocultar en la web con un solo clic
  const cambiarPublicado = useCallback(
    (fila) => guardar({ publicado: !fila.publicado }, fila.id),
    [guardar],
  );

  // Mueve una fila de la posición "desde" a "hasta" y guarda el
  // nuevo orden (1, 2, 3...). Solo se envían las filas que cambiaron.
  const mover = useCallback(
    async (desde, hasta) => {
      if (desde === hasta || hasta < 0 || hasta >= filas.length) return;
      const nuevas = [...filas];
      const [fila] = nuevas.splice(desde, 1);
      nuevas.splice(hasta, 0, fila);
      const conOrden = nuevas.map((f, indice) => ({ ...f, orden: indice + 1 }));
      const ordenAntes = Object.fromEntries(filas.map((f) => [f.id, f.orden]));
      const cambiadas = conOrden.filter((f) => f.orden !== ordenAntes[f.id]);

      setFilas(conOrden); // se ve al instante, sin esperar a internet
      try {
        await Promise.all(cambiadas.map((f) => tabla.editar(f.id, { orden: f.orden })));
        setAviso({ tipo: "ok", texto: "Orden guardado." });
      } catch (e) {
        setAviso({ tipo: "error", texto: mensajeDeError(e) });
        await cargar(); // si falló, se vuelve a mostrar el orden real
      }
    },
    [filas, tabla, cargar],
  );

  return { filas, cargando, aviso, setAviso, cargar, guardar, borrar, cambiarPublicado, mover };
}
