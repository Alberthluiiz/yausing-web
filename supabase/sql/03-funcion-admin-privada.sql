-- =========================================================
-- 03-funcion-admin-privada.sql
-- Arreglo de seguridad que pidió el revisor de Supabase:
-- la función es_admin() se mueve al esquema "privado", que NO
-- se publica en la API. Las reglas la siguen usando, pero nadie
-- puede llamarla desde internet (/rest/v1/rpc/es_admin).
-- =========================================================
create schema if not exists privado;
alter function public.es_admin() set schema privado;
revoke all on schema privado from public;
grant usage on schema privado to anon, authenticated;
revoke execute on function privado.es_admin() from public;
grant execute on function privado.es_admin() to anon, authenticated;
