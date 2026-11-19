// =========================================================
// useConfirmar.js · Pregunta "¿Seguro?" antes de borrar,
// con una ventana del panel (en vez del cuadro gris del navegador).
//
// Uso:
//   const { confirmar, ventana } = useConfirmar();
//   if (await confirmar({ titulo: "¿Borrar X?", texto: "No se puede deshacer." })) { ...borrar }
//   <Confirmar {...ventana} />   ← en el JSX de la página
// =========================================================
import { useCallback, useRef, useState } from "react";

export function useConfirmar() {
  const [pregunta, setPregunta] = useState(null); // { titulo, texto, boton }
  const resolverRef = useRef(null);

  // Abre la ventana y espera la respuesta (true = sí, false = no)
  const confirmar = useCallback(
    (opciones) =>
      new Promise((resolver) => {
        resolverRef.current?.(false); // si había otra pregunta abierta, cuenta como "no"
        resolverRef.current = resolver;
        setPregunta(opciones);
      }),
    [],
  );

  const responder = useCallback((si) => {
    resolverRef.current?.(si);
    resolverRef.current = null;
    setPregunta(null);
  }, []);

  return { confirmar, ventana: { pregunta, alResponder: responder } };
}
