-- =========================================================
-- 07-agotado-y-fin-de-ofertas.sql  (10/11/2026)
--   * productos.agotado: Mary marca "Agotado" sin borrar el producto.
--     La web lo muestra en gris, al final, con botón "Avísame".
--   * ofertas.termina_el: día en que termina la oferta (opcional).
--     Pasado ese día, la oferta deja de verse en la web.
--     Si se deja vacío, la oferta dura hasta fin de mes.
-- Las reglas de seguridad (RLS) de cada tabla no cambian:
-- el público solo lee, y solo la admin puede editar.
-- =========================================================

alter table public.productos
  add column if not exists agotado boolean not null default false;

alter table public.ofertas
  add column if not exists termina_el date;

-- La fecha debe ser razonable (entre 2024 y 2099)
alter table public.ofertas
  drop constraint if exists ofertas_termina_el_valida;
alter table public.ofertas
  add constraint ofertas_termina_el_valida
  check (termina_el is null or termina_el between date '2024-01-01' and date '2099-12-31');
