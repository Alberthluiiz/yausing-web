// useTienda.js · Atajo para leer los datos de la tienda (ver context/TiendaContext.jsx)
import { useContext } from "react";
import { TiendaContext } from "../context/TiendaContext";

export function useTienda() {
  return useContext(TiendaContext);
}
