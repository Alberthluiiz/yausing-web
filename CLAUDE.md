# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Storefront for Yausig Churikuna (Indigenous clothing shop in Quito) plus an admin panel used by the non-technical owner ("Mary"). No checkout: every order is sent via WhatsApp. Stack: React 19 + Vite 8 (rolldown) + Supabase (DB, auth, storage) + Bootstrap 5 (CSS only, no Bootstrap JS) + Zustand, deployed on Netlify. Plain JavaScript/JSX, no TypeScript.

**The codebase is written in Spanish** — identifiers, file names, comments and UI text (`productos`, `guardar`, `listar`, `cargarTodo`…). Keep new code in Spanish and follow the existing header-comment style (a `// ===` banner explaining the file in plain language). Comments tagged `SEGURIDAD (chequeo N)` map to the audit in `docs/SEGURIDAD.md`.

## Commands

```bash
npm install
npm run dev      # Vite dev server → http://localhost:5173 (panel at /admin)
npm run build    # production build into dist/
npm run preview  # serve the built dist/
```

There is no test suite, linter or formatter configured. Verify changes with `npm run build` and by running the app.

Requires `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (copy `.env.example`); `src/supabase/cliente.js` throws at startup without them.

## Architecture

**Routing** (`src/routes/AppRouter.jsx`): the public site is a single page, `pages/publico/Inicio.jsx`, rendering all sections. `/producto/:id` also renders `Inicio` and opens the product detail as an overlay, so each product has a shareable URL. All `/admin/*` pages are `lazy()`-loaded so customers never download panel code; they sit behind `RutaProtegida`, which requires a session **and** `esAdmin`.

**State:**
- `SesionContext` wraps the whole app (`usuario`, `esAdmin`, `pideCodigo`). `esAdmin` is false until the TOTP code is entered when the admin has 2FA enabled (page `/admin/seguridad`; the DB enforces it too via `privado.es_admin()` checking `aal2`, see `supabase/sql/09-…`). Auth session is stored in `sessionStorage` deliberately (cleared when browser closes).
- `TiendaContext` wraps only public routes. It calls `cargarTodo()` once (tienda + categorías + productos + ofertas + galería in parallel) and uses a stale-while-revalidate cache in `localStorage` (`yausig-datos-v1`, 14-day max). **Bump the key version if the shape of the loaded data changes.**
- `store/pedidoStore.js` (Zustand + persist) is the "Mi pedido" cart; a line is keyed by `id|talla|color`.

**Data layer** (`src/supabase/`): `tablas.js#crearTabla(nombre, campos)` builds a `listar/crear/editar/borrar` helper that whitelists writable columns. `consultas.js` declares each table with its allowed fields — **when adding a DB column that the panel edits, add it to that field list or it is silently dropped.** `tienda` is a single row with `id = 1`. **Only files in `src/supabase/` import the Supabase client** — components, hooks and contexts call functions from there (e.g. `auth.js#leerSesion`, `escucharCambiosDeSesion`).

**Admin panel pattern:** list pages (Productos, Ofertas, Galería, Categorías) use `hooks/useListaAdmin.js` (load, save, delete, toggle `publicado`, reorder via `orden`, stable `cerrarAviso`). Their edit form uses `hooks/useFormulario.js` (`validar` from `utils/validar.js` + a page-local `preparar` that trims/casts before saving) and `components/admin/BotonesFormulario.jsx`; `?nuevo=1` opens an empty form via `hooks/useNuevoDesdeEnlace.js`. Errors are shown with `utils/errores.js#mensajeDeError`; throw `ErrorParaMostrar` when the message is already written for Mary and should be shown verbatim.

**Security model:** the anon key is public by design; real protection is Supabase RLS (`supabase/sql/`). Public reads only see rows where `publicado`/`activa` is true unless `es_admin()`. Admins are listed in the `administradores` table. Client-side, `utils/seguridad.js` sanitizes URLs (https only, Google Maps only for maps) and storage paths before rendering.

**Photos** (`supabase/fotos.js`, `utils/imagenes.js`): bucket `fotos`; uploads are resized and converted to WEBP in the browser, and a 600px thumbnail is stored at `miniaturas/<name>.webp` alongside the full image. DB rows store `foto_ruta` (storage path), not URLs.

**WhatsApp:** all message text lives in `utils/whatsapp.js`. "Pedir" also fires the `contar_pedido` RPC (fire-and-forget, `supabase/pedidos.js`).

**Database changes:** `supabase/sql/` holds numbered scripts (01…09) that were applied manually in the Supabase SQL editor. New schema changes go in a new numbered file.

## Netlify

- `netlify.toml`: SPA redirect, Node 22, and a strict CSP that hard-codes the Supabase project host. **Any new external origin (scripts, fonts, images, APIs) must be added to the CSP** or it will be blocked in production (it works in `npm run dev`, which doesn't apply these headers). Fonts are self-hosted via `@fontsource`, which fits the `font-src 'self'` rule.
- `netlify/edge-functions/vista-previa.js` injects Open Graph tags for `/producto/*` links; `sitemap.js` generates `/sitemap.xml` from published products.
- `netlify/functions/mantener-activo.mjs` is a daily scheduled ping to keep the free-tier Supabase project from pausing.
- These functions read the same `VITE_SUPABASE_*` env vars via `Netlify.env.get`.
- `vite.config.js` splits React and Supabase into separate vendor chunks and disables sourcemaps.
