// useSesion.js · Atajo para leer la sesión (ver context/SesionContext.jsx)
import { useContext } from "react";
import { SesionContext } from "../context/SesionContext";

export function useSesion() {
  return useContext(SesionContext);
}
