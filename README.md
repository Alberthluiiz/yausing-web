# Yausig Churikuna · Web + Panel de administración

Web de la tienda de ropa indígena de Mary (C.C. Ipiales del Sur, Local 67, Quito).

- **Web pública** (`/`): portada, nosotros, productos con filtros, detalle con talla/color/cantidad,
  "Mi pedido", ofertas, galería y contacto. Todo se pide por WhatsApp.
- **Panel** (`/admin`): Mary entra con su correo y contraseña y cambia productos, precios, fotos,
  ofertas, galería, categorías, horario, teléfono y redes. Sin tocar código.

Hecho con **React 19 + Vite + Supabase** (base de datos, login y fotos) y Bootstrap 5 (solo CSS).

---

## 1. Cómo arrancarla en tu PC (Git Bash)

```bash
cd ~/Desktop/PAGINAS-WEB-CLIENTES/yausig-churikuna-react
npm install          # solo la primera vez (descarga los programas)
npm run dev          # arranca la web → abre http://localhost:5173
```

- Panel: http://localhost:5173/admin
- Para detenerla: `Ctrl + C` en Git Bash.
- **Ya no se usa Live Server**: ahora la web la sirve Vite (`npm run dev`).

Si sale el error *"Falta el archivo .env"*: copia `.env.example`, llámalo `.env` y pega la
dirección y la clave **pública** de Supabase (Project Settings → API Keys).

## 2. Carpetas: ¿dónde cambio cada cosa?

```
yausig-churikuna-react/
├── .env                  ← claves de Supabase (NO se sube a GitHub)
├── .env.example          ← modelo del .env (este sí se sube)
├── netlify.toml          ← cómo se publica + cabeceras de seguridad
├── index.html            ← título y descripción para Google
├── public/               ← favicon y robots.txt (se copian tal cual)
├── supabase/sql/         ← el SQL de las tablas y reglas (para leer, ya está aplicado)
├── docs/                 ← auditoría de seguridad y respuestas de WhatsApp
└── src/
    ├── main.jsx          ← arranque: carga estilos y la App
    ├── App.jsx           ← une la sesión con las rutas
    ├── assets/img/       ← logos SVG
    ├── components/
    │   ├── comunes/      ← piezas que usan las dos partes (Foto, Precio, Ventana...)
    │   ├── publico/      ← cada sección de la web (Menu, Portada, Productos, Ofertas...)
    │   └── admin/        ← piezas del panel (Campo, CampoFoto, FilaAdmin, LayoutAdmin...)
    ├── context/          ← datos compartidos: sesión (SesionContext) y tienda (TiendaContext)
    ├── hooks/            ← funciones reutilizables (useSesion, useAparecer, useLimiteIntentos...)
    ├── pages/
    │   ├── publico/      ← Inicio (la tienda) y NoEncontrada (404)
    │   └── admin/        ← Login, Panel, Productos, Ofertas, Galeria, Categorias, Fotos, Tienda
    ├── routes/           ← AppRouter (todas las direcciones) y RutaProtegida (puerta del panel)
    ├── store/            ← pedidoStore: la bolsita "Mi pedido"
    ├── styles/           ← CSS: variables, base, publico/*.css, admin/admin.css
    ├── supabase/         ← conexión (cliente.js), consultas, fotos y login (auth.js)
    └── utils/            ← whatsapp.js (TEXTOS de los mensajes), validar, seguridad, formato...
```

| Quiero cambiar... | Archivo |
|---|---|
| Productos, precios, fotos, ofertas, horario, teléfono | **El panel** (`/admin`), no el código |
| Los textos de los mensajes de WhatsApp | `src/utils/whatsapp.js` |
| Colores de la marca | `src/styles/variables.css` |
| Textos de "Nosotros" | `src/components/publico/Nosotros.jsx` |
| Los 4 beneficios (envíos, pagos...) | `src/components/publico/Beneficios.jsx` |
| Título grande de la portada | `src/components/publico/Portada.jsx` |
| Opciones del menú | `src/components/publico/Menu.jsx` |
| Límite de intentos del login, tamaño de fotos | `src/utils/constantes.js` |
| Una página nueva | `src/pages/...` + agregarla en `src/routes/AppRouter.jsx` |

## 3. Cómo viaja un dato

```
Mary guarda en el panel → src/supabase/consultas.js → Supabase (revisa las reglas RLS)
Cliente abre la web → TiendaContext llama cargarTodo() → las secciones lo muestran
Cliente toca "Pedir" → src/utils/whatsapp.js arma el mensaje → se abre WhatsApp
```

## 4. Publicar (Netlify o tu dominio)

1. Sube el código a GitHub (sin `.env`, el `.gitignore` ya lo evita).
2. En Netlify: *Add new site → Import from GitHub*. Netlify lee `netlify.toml` solo.
3. En Netlify → *Site configuration → Environment variables* agrega
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (los mismos valores del `.env`).
4. En Supabase → *Authentication → URL Configuration* pon tu dominio en **Site URL**.
5. Dominio propio: Netlify → *Domain management → Add a domain*.

### Vista previa al compartir por WhatsApp

- `public/vista-previa.jpg` (1200×630) es la tarjeta que sale al compartir la web.
- `netlify/edge-functions/vista-previa.js` corre en Netlify (no en tu PC) y,
  en los enlaces `/producto/...`, pone la foto, el nombre y el precio de ese producto.
  Usa las mismas variables del paso 3. Netlify la encuentra solo.
- Para probarla después de publicar: pega el enlace en
  https://developers.facebook.com/tools/debug/ (WhatsApp usa lo mismo).

La auditoría de seguridad está en [`docs/SEGURIDAD.md`](docs/SEGURIDAD.md).
