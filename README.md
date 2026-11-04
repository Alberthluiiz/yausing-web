# Yausig Churikuna · Página web

Página del local de ropa indígena de Mary (C.C. Ipiales del Sur, Local 67, Quito).
Hecha con HTML + CSS + JavaScript + Bootstrap 5.

## Cómo abrirla
1. Abre la carpeta `yausig-churikuna` en VS Code.
2. Clic derecho en `index.html` → **Open with Live Server**.
   (Si la abres con doble clic NO cargan los productos, porque el navegador
   no deja leer el archivo JSON sin un servidor.)

## ¿Dónde cambio cada cosa?

| Quiero cambiar... | Archivo |
|---|---|
| Fotos, productos, precios, ofertas, galería | `datos/tienda.json` |
| WhatsApp, dirección, horario, mapa, redes | `datos/tienda.json` → `"tienda"` |
| Fotos de la portada y de Nosotros | `datos/tienda.json` → `"imagenes"` |
| Textos fijos (títulos, Nosotros) | `index.html` |
| Colores | `css/variables.css` |
| Diseño de una sección | `css/<sección>.css` (menu, portada, productos...) |
| Cómo funciona una sección | `js/modulos/<sección>.js` |

## Cómo cambiar una foto
1. Pon tu foto en `img/productos/` (ejemplo: `poncho-rojo.jpg`).
2. En `datos/tienda.json` cambia `"foto": "img/productos/poncho-rojo.jpg"`.
3. Si era un dibujo, cambia `"dibujo": true` por `"dibujo": false`.

Reglas del JSON: los textos van entre comillas, después de cada dato va una coma
(menos el último), y los precios van sin comillas (`"precio": 35`).

## Carpetas
```
yausig-churikuna/
├── index.html          → estructura de la página y "moldes" (<template>) de las tarjetas
├── _headers            → seguridad extra para Netlify
├── datos/tienda.json   → TODOS los datos y fotos (la "API" de la página)
├── css/
│   ├── estilos.css     → junta todos los demás
│   ├── variables.css   → colores del logo
│   ├── base.css, menu.css, portada.css, nosotros.css, productos.css,
│   ├── ofertas.css, galeria.css, contacto.css, pie.css
│   ├── animaciones.css
│   └── responsive.css  → ajustes para celular
├── js/
│   ├── main.js         → arranca todo
│   ├── config.js       → variables generales
│   └── modulos/        → un archivo por tarea
│       ├── datos.js        lee el JSON
│       ├── seguridad.js    revisa los datos antes de mostrarlos
│       ├── utilidades.js   funciones pequeñas
│       ├── whatsapp.js, productos.js, ofertas.js, reloj.js,
│       └── galeria.js, contacto.js, menu.js, animaciones.js
└── img/                → logos (SVG), fotos de productos e ilustraciones
```

## Seguridad que tiene
- **CSP** (en el `<head>`): solo se carga código de nuestra página y de Bootstrap.
- **integrity** en Bootstrap: si alguien cambiara el archivo en internet, no se carga.
- Los datos del JSON se muestran con `textContent` (nunca se ejecutan como código).
- `seguridad.js` acepta solo fotos de la carpeta `img/`, colores `#xxxxxx`,
  enlaces `https://` y mapas de Google.
- Los enlaces que abren otra pestaña usan `rel="noopener noreferrer"`.
- `_headers` añade protecciones extra en Netlify.
