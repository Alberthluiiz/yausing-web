// =========================================================
// pedidos.js · Contador de "Pedir por WhatsApp"
//
// Cada vez que un cliente toca "Pedir por WhatsApp" se guarda
// una rayita para ese producto (sin datos de la persona).
// Mary ve en el panel cuáles se piden más.
// SQL: supabase/sql/08-contador-de-pedidos.sql
// =========================================================

import { supabase } from "./cliente";

// Suma un pedido a cada producto. Si falla, no pasa nada:
// el cliente igual va a WhatsApp (nunca lo hacemos esperar).
export function contarPedido(...ids) {
  const unicos = [...new Set(ids.filter(Boolean))];
  for (const id of unicos) {
    supabase
      .rpc("contar_pedido", { p_producto: id })
      .then(() => {}, () => {});
  }
}

// Los 10 productos más pedidos en los últimos "dias" (solo el admin)
export async function productosMasPedidos(dias = 30) {
  const { data, error } = await supabase.rpc("resumen_pedidos", { p_dias: dias });
  if (error) throw error;
  return data;
}
