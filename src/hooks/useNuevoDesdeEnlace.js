// =========================================================
// useNuevoDesdeEnlace.js · Abre el formulario vacío si la página
// llega con ?nuevo=1 (los accesos rápidos del inicio del panel).
//
// Uso:  useNuevoDesdeEnlace(setEditando, VACIO);
// =========================================================
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useNuevoDesdeEnlace(abrir, vacio) {
  const [parametros, setParametros] = useSearchParams();

  useEffect(() => {
    if (parametros.get("nuevo")) {
      abrir(vacio);
      setParametros({}, { replace: true }); // quita el ?nuevo=1 de la dirección
    }
  }, [parametros, setParametros, abrir, vacio]);
}
