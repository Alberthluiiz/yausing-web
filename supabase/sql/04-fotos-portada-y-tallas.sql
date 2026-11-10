-- =========================================================
-- 04-fotos-portada-y-tallas.sql
-- Agrega las 2 fotos de la portada a la tabla "tienda"
-- (antes estaban en tienda.json → "imagenes") y pone tallas
-- de ejemplo a los productos de ropa.
-- =========================================================
alter table public.tienda
  add column foto_portada_grande text check (foto_portada_grande is null or foto_portada_grande ~ '^[a-z0-9/_.-]+$'),
  add column foto_portada_chica  text check (foto_portada_chica  is null or foto_portada_chica  ~ '^[a-z0-9/_.-]+$');

update public.tienda
set foto_portada_grande = 'productos/35-fajas-de-colores.png',
    foto_portada_chica  = 'productos/36-collar-dorado-de-hilos.png'
where id = 1;

-- Tallas de ejemplo (Mary las cambia desde el panel)
update public.productos p
set tallas = case c.nombre
  when 'Ponchos'  then '{Única}'::text[]
  when 'Collares' then '{}'::text[]
  else '{S,M,L,XL}'::text[]
end
from public.categorias c
where c.id = p.categoria_id;
