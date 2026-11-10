-- =========================================================
-- 02-datos-iniciales.sql
-- Copia los datos que estaban en datos/tienda.json.
-- Las fotos (foto_ruta) se suben después al depósito "fotos".
-- =========================================================

insert into public.tienda (id, nombre, whatsapp, telefono_visible, direccion, referencia, horario, mapa_url, facebook, instagram, tiktok)
values (1, 'Yausig Churikuna', '593961380728', '096 138 0728',
        'Centro Comercial Ipiales del Sur, Local 67', 'Cerca de Servientrega · Quito',
        array['Lunes a sábado · 9:00 a 18:00', 'Domingo · 9:00 a 14:00'],
        'https://www.google.com/maps?q=Centro+Comercial+Ipiales+del+Sur,+Quito&output=embed',
        '', '', '');

insert into public.categorias (nombre, orden) values
  ('Sacos', 1), ('Ponchos', 2), ('Pantalones', 3), ('Camisas', 4), ('Blusas', 5), ('Collares', 6);

insert into public.productos (nombre, categoria_id, descripcion, precio, foto_ruta, orden)
select p.nombre, c.id, p.descripcion, p.precio, p.foto_ruta, p.orden
from (values
  ('Saco de lana tejido',  'Sacos',    'Sacos tejidos.',                       18.00, 'productos/23-saco-celeste-bordado.png',         1),
  ('Saco tipo chaqueta',   'Sacos',    'Sacos de tela tipo chaqueta.',         22.00, 'productos/07-blusa-blanca-saco-cafe-faja.png',  2),
  ('Saco de lana tejido',  'Sacos',    'Abrigador, tejido a mano.',            35.00, 'productos/02-blusas-y-sacos-colgados.png',      3),
  ('Saco de tejidos',      'Sacos',    'Abrigador, tejido.',                   38.00, 'productos/29-conjunto-saco-y-falda.png',        4),
  ('Poncho tradicional',   'Ponchos',  'Lana gruesa, colores vivos.',          90.00, 'productos/ponchos.png',                         5),
  ('Poncho tradicional',   'Ponchos',  'Lana gruesa, colores vivos.',          28.00, 'productos/01-ponchos-y-chales.png',             6),
  ('Blusa bordada',        'Blusas',   'Blusas bordadas llanas y con mullos.', 45.00, 'productos/11-blusa-bordada-saco-rosado.png',    7),
  ('Blusa bordada',        'Blusas',   'Blusas bordadas de orlón.',            35.00, 'productos/14-blusa-bordada-saco-vino.png',      8),
  ('Blusa de tela',        'Blusas',   'Blusa de tela con randa.',             18.00, 'productos/13-blusa-blanca-con-chalina.png',     9),
  ('Cinta de colores',     'Collares', 'Cinta para el cabello, varios colores.', 3.50, 'productos/15-cintas-de-colores.png',          10),
  ('Collar',               'Collares', 'Collares de colores.',                 18.00, 'productos/24-collares-rojo-y-azul.png',        11),
  ('Pulseras',             'Collares', 'Pulseras de colores.',                  5.00, 'productos/26-pulseras-de-mullos.png',          12),
  ('Collar rosado perlas', 'Collares', 'Collar rosa con dije.',                22.00, 'productos/31-collar-perlas-rosadas.png',       13),
  ('Collar dorado',        'Collares', 'Collar dorado.',                       55.00, 'productos/38-collar-dorado.png',               14),
  ('Camisa de indu',       'Camisas',  'Camisas de indu, varios colores.',     12.00, 'productos/17-camisa-bordada-hombre.png',       15)
) as p(nombre, categoria, descripcion, precio, foto_ruta, orden)
join public.categorias c on c.nombre = p.categoria;

insert into public.ofertas (nombre, descripcion, precio_antes, precio_ahora, foto_ruta, color, orden) values
  ('Combo caballero', 'Poncho + camisa cuello militar.', 120, 110, 'productos/ponchos.png', 'rojo', 1),
  ('Blusa + faja + anaco + bolso', 'Llévate el conjunto y ármalo a tu gusto.', 65, 60, 'productos/25-conjunto-blusa-bordada-y-falda.png', 'naranja', 2),
  ('2 pantalones', 'Elige 2 pantalones, blancos o de colores.', 22, 16, 'productos/16-pantalon-de-rayas.png', 'verde', 3);

insert into public.galeria (foto_ruta, texto, tamano, orden) values
  ('productos/fondo.png',  'Prendas del local',  'grande', 1),
  ('productos/ponchos.png','Ponchos',            'normal', 2),
  ('productos/saco.png',   'Sacos de lana',      'normal', 3),
  ('productos/blusas.png', 'Bordados',           'ancha',  4),
  ('productos/bayeta.png', 'Tejidos de colores', 'normal', 5),
  ('productos/anacos.png', 'Telas bordadas',     'normal', 6),
  ('productos/collar.png', 'Accesorios',         'ancha',  7);
