// =========================================================
// pedidoStore.js · "Mi pedido" (la bolsita de compras)
//
// Guarda los productos que el cliente va eligiendo, para mandarlos
// todos juntos en UN solo mensaje de WhatsApp.
// Se guarda en el navegador del cliente (no tiene datos privados).
//
// Uso:  const agregar = usePedido((estado) => estado.agregar);
// =========================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CANTIDAD_MAXIMA } from "../utils/constantes";

// Un mismo producto con otra talla o color es otra línea del pedido
const claveDe = (item) => `${item.id}|${item.talla ?? ""}|${item.color ?? ""}`;
const limitar = (n) => Math.min(CANTIDAD_MAXIMA, Math.max(1, Math.floor(Number(n) || 1)));

export const usePedido = create(
  persist(
    (set) => ({
      items: [],
      abierto: false,

      abrir: () => set({ abierto: true }),
      cerrar: () => set({ abierto: false }),

      agregar: (producto, { talla = "", color = "", cantidad = 1 } = {}) =>
        set((estado) => {
          const nuevo = { id: producto.id, nombre: producto.nombre, precio: Number(producto.precio), talla, color };
          const clave = claveDe(nuevo);
          const existe = estado.items.find((item) => item.clave === clave);
          const items = existe
            ? estado.items.map((item) => (item.clave === clave ? { ...item, cantidad: limitar(item.cantidad + cantidad) } : item))
            : [...estado.items, { ...nuevo, clave, cantidad: limitar(cantidad) }];
          return { items, abierto: true };
        }),

      cambiarCantidad: (clave, cantidad) =>
        set((estado) => ({
          items: estado.items.map((item) => (item.clave === clave ? { ...item, cantidad: limitar(cantidad) } : item)),
        })),

      quitar: (clave) => set((estado) => ({ items: estado.items.filter((item) => item.clave !== clave) })),

      vaciar: () => set({ items: [] }),
    }),
    {
      name: "yausig-pedido",
      partialize: (estado) => ({ items: estado.items }), // solo se guarda la lista, no si está abierta
    },
  ),
);
