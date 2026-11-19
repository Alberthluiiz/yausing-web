-- =========================================================
-- 09-endurecer-seguridad.sql
-- Arreglos de la revisión de seguridad (noviembre 2026).
-- Se puede ejecutar más de una vez sin romper nada.
--
-- 1. VERIFICACIÓN EN DOS PASOS: si la administradora activó el
--    código del celular (panel → Seguridad), la base de datos solo
--    la deja editar cuando entró CON el código (nivel "aal2").
--    Así, aunque alguien adivine la contraseña, no puede cambiar
--    nada. Si no tiene el código activado, todo sigue como antes.
--
-- 2. CONTADOR DE PEDIDOS CON LÍMITE: contar_pedido() es pública
--    (la llama la web de los clientes). Ahora ignora las llamadas
--    de más: máximo 3 por minuto por producto y 100 por hora en
--    total. Así nadie puede inflar "lo más pedido" ni llenar la
--    base de datos. Además borra los registros de más de 400 días.
--
-- 3. PERMISOS MÍNIMOS: los visitantes (anon) ya no tienen permiso
--    de escribir en ninguna tabla. Antes las reglas RLS ya lo
--    impedían; esto es una segunda barrera por si algún día una
--    regla queda mal escrita.
-- =========================================================


-- ---------------------------------------------------------
-- 1. es_admin() pide el código del celular si está activado
-- (create or replace mantiene los permisos que ya tenía)
-- ---------------------------------------------------------
create or replace function privado.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
           select 1 from public.administradores
           where usuario_id = (select auth.uid())
         )
     and (
           -- entró con el código del celular...
           coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
           -- ...o todavía no tiene el código activado
           or not exists (
                select 1 from auth.mfa_factors f
                where f.user_id = (select auth.uid())
                  and f.status = 'verified'
              )
         );
$$;


-- ---------------------------------------------------------
-- 2. contar_pedido() con límite
-- ---------------------------------------------------------
create or replace function public.contar_pedido(p_producto uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Demasiados toques seguidos en este producto → no se cuenta
  if (select count(*) from public.pedidos_whatsapp w
      where w.producto_id = p_producto
        and w.creado_el > now() - interval '1 minute') >= 3 then
    return;
  end if;

  -- Demasiados toques en total en la última hora → no se cuenta
  if (select count(*) from public.pedidos_whatsapp w
      where w.creado_el > now() - interval '1 hour') >= 100 then
    return;
  end if;

  insert into public.pedidos_whatsapp (producto_id)
  select p.id from public.productos p
  where p.id = p_producto and p.publicado;

  -- Limpieza: el panel solo mira los últimos días, lo viejo sobra
  delete from public.pedidos_whatsapp
  where creado_el < now() - interval '400 days';
end;
$$;
revoke all on function public.contar_pedido(uuid) from public;
grant execute on function public.contar_pedido(uuid) to anon, authenticated;


-- ---------------------------------------------------------
-- 3. Permisos mínimos en las tablas
-- ---------------------------------------------------------
-- Visitantes: solo pueden LEER el contenido de la tienda
revoke insert, update, delete, truncate, references, trigger
  on public.tienda, public.categorias, public.productos, public.ofertas, public.galeria
  from anon;

-- Usuarios conectados: escriben (si RLS los deja), pero nada raro
revoke truncate, references, trigger
  on public.tienda, public.categorias, public.productos, public.ofertas, public.galeria
  from authenticated;
-- La fila de la tienda nunca se crea ni se borra desde la web
revoke insert, delete on public.tienda from authenticated;

-- Lista de administradores: los visitantes no la tocan; la
-- administradora solo puede ver su propia fila (regla RLS)
revoke all on public.administradores from anon;
revoke insert, update, delete, truncate, references, trigger
  on public.administradores from authenticated;

-- El resumen de pedidos es solo para el panel
revoke execute on function public.resumen_pedidos(int) from anon;


-- ---------------------------------------------------------
-- Para revisar después de ejecutarlo:
--   select grantee, table_name, string_agg(privilege_type, ',')
--   from information_schema.role_table_grants
--   where table_schema = 'public' and grantee in ('anon','authenticated')
--   group by 1, 2 order by 2, 1;
-- ---------------------------------------------------------
