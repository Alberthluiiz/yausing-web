-- =========================================================
-- 05-fotos-webp-y-cuadritos-portada.sql
-- 1. Las fotos ahora son .webp (pesan mucho menos que .png)
-- 2. Los 2 cuadritos de la portada ("Nueva temporada" y
--    "C.C. Ipiales del Sur") se pueden cambiar desde el panel.
-- =========================================================
update public.productos set foto_ruta = regexp_replace(foto_ruta, '\.png$', '.webp') where foto_ruta like '%.png';
update public.ofertas   set foto_ruta = regexp_replace(foto_ruta, '\.png$', '.webp') where foto_ruta like '%.png';
update public.galeria   set foto_ruta = regexp_replace(foto_ruta, '\.png$', '.webp') where foto_ruta like '%.png';
update public.tienda
set foto_portada_grande = regexp_replace(foto_portada_grande, '\.png$', '.webp'),
    foto_portada_chica  = regexp_replace(foto_portada_chica,  '\.png$', '.webp')
where id = 1;

alter table public.tienda
  add column burbuja1_titulo text not null default 'Nueva temporada'     check (char_length(burbuja1_titulo) <= 40),
  add column burbuja1_texto  text not null default 'Bordados y tejidos'  check (char_length(burbuja1_texto)  <= 40),
  add column burbuja2_titulo text not null default 'C.C. Ipiales del Sur' check (char_length(burbuja2_titulo) <= 40),
  add column burbuja2_texto  text not null default 'Local 67'            check (char_length(burbuja2_texto)  <= 40);
