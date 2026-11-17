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
├── netlify/              ← código que corre en Netlify (no en el navegador)
│   ├── edge-functions/   ← vista-previa.js (tarjetita al compartir) y sitemap.js (lista para Google)
│   └── functions/        ← mantener-activo.mjs: evita que Supabase se pause
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

### Que Supabase no se pause (¡importante!)

En el plan gratis, Supabase **pausa la base de datos** si pasan unos 7 días
con poca actividad. Cuando está pausada, la web no muestra productos y el panel no entra.

- `netlify/functions/mantener-activo.mjs` corre sola **una vez al día** en Netlify
  y hace una consulta pequeñita para que Supabase vea actividad. Netlify la encuentra sola.
- Para ver si corrió: Netlify → *Logs → Functions → mantener-activo*.
- Si aun así se pausa: Supabase → tu proyecto → botón **Restore project**
  (tarda unos minutos y no se pierde nada).

### Velocidad

- El panel (`/admin`) y sus estilos se descargan solo al entrar al panel.
- React y Supabase van en archivos aparte (`vite.config.js`): el navegador
  los guarda y no los vuelve a bajar cuando cambias tu código.
- Las fotos se suben ya achicadas y en WEBP (`src/utils/imagenes.js`).
- **Miniaturas:** cada foto tiene una copia chica de 600 px en `miniaturas/` (tarjetas y galería).
  Se crea sola al subir. Para fotos antiguas: panel → *Fotos* → **Crear miniaturas que faltan**.
- **Datos guardados:** la web guarda en el navegador los datos de la última visita
  (`src/context/TiendaContext.jsx`) y aparece al instante; luego se actualiza sola.
- El logo del menú y del pie es `yausig-logo.webp` (13 KB). El `.svg` queda como original.

### Google

- `/sitemap.xml` se arma solo con todos los productos publicados (`netlify/edge-functions/sitemap.js`).
- `public/robots.txt` le dice a Google dónde está. **Si cambias de dominio, cambia la dirección ahí.**
- En `index.html` están los datos del negocio (nombre, dirección, teléfono) para Google.
- Recomendado: crear el perfil gratis en **Google Business Profile** (Google Maps) con el horario y fotos.

### Panel: lo más pedido y copia de seguridad

- Cada vez que tocan "Pedir por WhatsApp" se suma 1 a ese producto (sin datos de la persona).
  El inicio del panel muestra los 10 más pedidos de los últimos 30 días.
  SQL: `supabase/sql/08-contador-de-pedidos.sql`.
- Botón **Descargar copia** en el inicio del panel: baja un `.json` con todo. Hazlo una vez al mes.

La auditoría de seguridad está en [`docs/SEGURIDAD.md`](docs/SEGURIDAD.md).
