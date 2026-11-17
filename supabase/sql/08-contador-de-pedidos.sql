-- =========================================================
-- 08-contador-de-pedidos.sql
-- Cuenta cuántas veces tocan "Pedir por WhatsApp" en cada
-- producto, para que Mary vea en el panel qué se pide más.
--
-- SEGURIDAD:
-- - La tabla tiene RLS: NADIE de afuera puede leerla ni escribir
--   directo. Solo el administrador puede leerla.
-- - Los clientes solo pueden llamar a contar_pedido(id), que
--   guarda UNA fila si el producto existe y está publicado.
-- - No se guarda nada de la persona (ni IP, ni nombre, ni teléfono).
-- =========================================================

create table if not exists public.pedidos_whatsapp (
  id bigint generated always as identity primary key,
  producto_id uuid not null references public.productos (id) on delete cascade,
  creado_el timestamptz not null default now()
);
create index if not exists pedidos_whatsapp_fecha on public.pedidos_whatsapp (creado_el desc);
create index if not exists pedidos_whatsapp_producto on public.pedidos_whatsapp (producto_id);

alter table public.pedidos_whatsapp enable row level security;
revoke all on public.pedidos_whatsapp from anon, authenticated;
grant select on public.pedidos_whatsapp to authenticated;
create policy "admin lee pedidos" on public.pedidos_whatsapp
  for select to authenticated using ((select privado.es_admin()));

-- Los clientes llaman a esta función (POST /rest/v1/rpc/contar_pedido)
create or replace function public.contar_pedido(p_producto uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.pedidos_whatsapp (producto_id)
  select p.id from public.productos p where p.id = p_producto and p.publicado;
$$;
revoke all on function public.contar_pedido(uuid) from public;
grant execute on function public.contar_pedido(uuid) to anon, authenticated;

-- Resumen para el panel: los productos más pedidos en los últimos N días.
-- "security invoker": usa las reglas de quien la llama → solo el admin ve datos.
create or replace function public.resumen_pedidos(p_dias int default 30)
returns table (producto_id uuid, nombre text, pedidos bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select w.producto_id, p.nombre::text, count(*) as pedidos
  from public.pedidos_whatsapp w
  join public.productos p on p.id = w.producto_id
  where w.creado_el > now() - make_interval(days => least(greatest(p_dias, 1), 365))
  group by w.producto_id, p.nombre
  order by pedidos desc
  limit 10;
$$;
revoke all on function public.resumen_pedidos(int) from public;
grant execute on function public.resumen_pedidos(int) to authenticated;
