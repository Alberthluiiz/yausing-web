-- =========================================================
-- 01-tablas-y-seguridad.sql
-- Crea las tablas de la tienda y las reglas de seguridad (RLS).
--
-- Idea general:
--   * Cualquier visitante puede LEER lo que está publicado.
--   * Solo las personas que están en la tabla "administradores"
--     pueden CREAR, EDITAR o BORRAR.
--   * Esto lo controla la base de datos, no el navegador:
--     aunque alguien copie la clave pública, no puede cambiar nada.
-- =========================================================


-- ---------------------------------------------------------
-- 1. ADMINISTRADORES
-- Lista de usuarios (de Supabase Auth) que pueden editar.
-- Nadie se puede agregar solo: se agrega desde el panel de Supabase.
-- ---------------------------------------------------------
create table public.administradores (
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  creado_en  timestamptz not null default now()
);

alter table public.administradores enable row level security;

-- Función que responde: ¿el usuario conectado es administrador?
-- "security definer" = se ejecuta con permisos del dueño, así puede leer
-- la tabla administradores sin abrirla al público.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores
    where usuario_id = (select auth.uid())
  );
$$;

-- Un administrador solo puede ver su propia fila (para saber que es admin).
create policy "admin ve su fila"
  on public.administradores for select
  to authenticated
  using (usuario_id = (select auth.uid()));


-- ---------------------------------------------------------
-- 2. FUNCIÓN PARA LA FECHA DE CAMBIO
-- Cada vez que se edita una fila, guarda la hora en "actualizado_en".
-- ---------------------------------------------------------
create or replace function public.marcar_actualizado()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;


-- ---------------------------------------------------------
-- 3. TIENDA (datos generales: una sola fila)
-- ---------------------------------------------------------
create table public.tienda (
  id               smallint primary key default 1 check (id = 1), -- solo puede existir la fila 1
  nombre           text not null check (char_length(nombre) between 2 and 80),
  whatsapp         text not null check (whatsapp ~ '^593[0-9]{9}$'),        -- ej: 593961380728
  telefono_visible text not null check (char_length(telefono_visible) <= 30),
  direccion        text not null check (char_length(direccion) <= 150),
  referencia       text check (char_length(referencia) <= 150),
  horario          text[] not null default '{}',
  mapa_url         text check (mapa_url is null or mapa_url like 'https://www.google.com/maps%'),
  facebook         text check (facebook  is null or facebook  = '' or facebook  like 'https://%'),
  instagram        text check (instagram is null or instagram = '' or instagram like 'https://%'),
  tiktok           text check (tiktok    is null or tiktok    = '' or tiktok    like 'https://%'),
  actualizado_en   timestamptz not null default now()
);


-- ---------------------------------------------------------
-- 4. CATEGORÍAS (Sacos, Ponchos, Blusas...)
-- ---------------------------------------------------------
create table public.categorias (
  id             bigint generated always as identity primary key,
  nombre         text not null unique check (char_length(nombre) between 2 and 40),
  orden          int  not null default 0,
  activa         boolean not null default true,
  actualizado_en timestamptz not null default now()
);


-- ---------------------------------------------------------
-- 5. PRODUCTOS
-- foto_ruta = nombre del archivo dentro del depósito "fotos"
--             (ej: productos/23-saco-celeste-bordado.png)
-- ---------------------------------------------------------
create table public.productos (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null check (char_length(nombre) between 2 and 80),
  categoria_id   bigint references public.categorias (id) on delete set null,
  descripcion    text check (char_length(descripcion) <= 300),
  precio         numeric(8,2) not null check (precio >= 0 and precio <= 10000),
  foto_ruta      text check (foto_ruta is null or foto_ruta ~ '^[a-z0-9/_.-]+$'),
  tallas         text[] not null default '{}',   -- ej: {S,M,L}
  colores        text[] not null default '{}',   -- ej: {Rojo,Azul}
  destacado      boolean not null default false,
  publicado      boolean not null default true,  -- false = escondido de la web
  orden          int not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index productos_categoria_idx on public.productos (categoria_id);


-- ---------------------------------------------------------
-- 6. OFERTAS (combos con precio antes / ahora)
-- ---------------------------------------------------------
create table public.ofertas (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null check (char_length(nombre) between 2 and 80),
  descripcion    text check (char_length(descripcion) <= 300),
  precio_antes   numeric(8,2) not null check (precio_antes >= 0),
  precio_ahora   numeric(8,2) not null check (precio_ahora >= 0),
  foto_ruta      text check (foto_ruta is null or foto_ruta ~ '^[a-z0-9/_.-]+$'),
  color          text not null default 'rojo'
                 check (color in ('rojo','naranja','amarillo','verde','azul')),
  publicado      boolean not null default true,
  orden          int not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  check (precio_ahora <= precio_antes)
);


-- ---------------------------------------------------------
-- 7. GALERÍA
-- ---------------------------------------------------------
create table public.galeria (
  id             uuid primary key default gen_random_uuid(),
  foto_ruta      text not null check (foto_ruta ~ '^[a-z0-9/_.-]+$'),
  texto          text check (char_length(texto) <= 80),
  tamano         text not null default 'normal' check (tamano in ('normal','grande','ancha')),
  publicado      boolean not null default true,
  orden          int not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);


-- ---------------------------------------------------------
-- 8. "actualizado_en" automático en todas las tablas
-- ---------------------------------------------------------
create trigger tienda_actualizado     before update on public.tienda     for each row execute function public.marcar_actualizado();
create trigger categorias_actualizado before update on public.categorias for each row execute function public.marcar_actualizado();
create trigger productos_actualizado  before update on public.productos  for each row execute function public.marcar_actualizado();
create trigger ofertas_actualizado    before update on public.ofertas    for each row execute function public.marcar_actualizado();
create trigger galeria_actualizado    before update on public.galeria    for each row execute function public.marcar_actualizado();


-- ---------------------------------------------------------
-- 9. SEGURIDAD (RLS) DE LAS TABLAS
-- ---------------------------------------------------------
alter table public.tienda     enable row level security;
alter table public.categorias enable row level security;
alter table public.productos  enable row level security;
alter table public.ofertas    enable row level security;
alter table public.galeria    enable row level security;

-- Leer: el público ve solo lo publicado / activo. El admin ve todo.
create policy "leer tienda"     on public.tienda     for select to anon, authenticated using (true);
create policy "leer categorias" on public.categorias for select to anon, authenticated using (activa    or (select public.es_admin()));
create policy "leer productos"  on public.productos  for select to anon, authenticated using (publicado or (select public.es_admin()));
create policy "leer ofertas"    on public.ofertas    for select to anon, authenticated using (publicado or (select public.es_admin()));
create policy "leer galeria"    on public.galeria    for select to anon, authenticated using (publicado or (select public.es_admin()));

-- Escribir: solo administradores (crear, editar, borrar).
create policy "admin edita tienda"     on public.tienda     for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "admin crea categorias"  on public.categorias for insert to authenticated with check ((select public.es_admin()));
create policy "admin edita categorias" on public.categorias for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "admin borra categorias" on public.categorias for delete to authenticated using ((select public.es_admin()));
create policy "admin crea productos"   on public.productos  for insert to authenticated with check ((select public.es_admin()));
create policy "admin edita productos"  on public.productos  for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "admin borra productos"  on public.productos  for delete to authenticated using ((select public.es_admin()));
create policy "admin crea ofertas"     on public.ofertas    for insert to authenticated with check ((select public.es_admin()));
create policy "admin edita ofertas"    on public.ofertas    for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "admin borra ofertas"    on public.ofertas    for delete to authenticated using ((select public.es_admin()));
create policy "admin crea galeria"     on public.galeria    for insert to authenticated with check ((select public.es_admin()));
create policy "admin edita galeria"    on public.galeria    for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "admin borra galeria"    on public.galeria    for delete to authenticated using ((select public.es_admin()));


-- ---------------------------------------------------------
-- 10. DEPÓSITO DE FOTOS (Storage)
-- Público para VER (la web muestra las fotos),
-- solo imágenes JPG/PNG/WEBP de máximo 5 MB.
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg','image/png','image/webp']);

-- Solo el administrador puede subir, cambiar, borrar o listar fotos.
-- (Las fotos se ven por su enlace público; nadie más puede listarlas.)
create policy "admin lista fotos"  on storage.objects for select to authenticated using (bucket_id = 'fotos' and (select public.es_admin()));
create policy "admin sube fotos"   on storage.objects for insert to authenticated with check (bucket_id = 'fotos' and (select public.es_admin()));
create policy "admin cambia fotos" on storage.objects for update to authenticated using (bucket_id = 'fotos' and (select public.es_admin())) with check (bucket_id = 'fotos' and (select public.es_admin()));
create policy "admin borra fotos"  on storage.objects for delete to authenticated using (bucket_id = 'fotos' and (select public.es_admin()));
