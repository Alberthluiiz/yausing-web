# Auditoría de seguridad · Yausig Churikuna

Revisión hecha el 10/11/2026 antes de lanzar, archivo por archivo.
✅ = cumple · ⚠️ = cumple con una nota · 👉 = lo tienes que hacer tú en Supabase/Netlify

| # | Chequeo | Estado | Dónde / cómo |
|---|---|---|---|
| 1 | Claves fuera del código | ✅ | Se leen de `.env` (`src/supabase/cliente.js`). `.env` está en `.gitignore`. Solo se usa la clave **pública** (anon/publishable), que está hecha para estar en el navegador. La clave secreta (`service_role`) **no está en ninguna parte del proyecto**. En Netlify van como variables de entorno. |
| 2 | Contraseñas con hash | ✅ | Las guarda **Supabase Auth con bcrypt**. La web nunca las guarda; el campo se borra después de cada intento (`pages/admin/Login.jsx`). |
| 3 | Límite de intentos en el login | ✅ | Dos capas: Supabase limita los intentos por IP en su servidor (la protección real), y la web bloquea el botón **5 minutos tras 5 errores** (`hooks/useLimiteIntentos.js`). |
| 4 | Login en cada ruta | ✅ | Todo `/admin/*` pasa por `routes/RutaProtegida.jsx` (sesión + ser administradora). Y aunque alguien se la salte, **la base de datos (RLS) no deja escribir** a nadie que no esté en la tabla `administradores`. |
| 5 | Cada usuario solo sus datos | ✅ | RLS activado en las 6 tablas y en las fotos. Visitantes: solo **leen** lo publicado. Escribir: solo administradores. La tabla `administradores` solo deja ver la fila propia. La función `es_admin()` está en un esquema privado que no se publica en la API. Probado: un visitante que intentó cambiar precios cambió **0 filas**. El revisor de seguridad de Supabase: **sin avisos**. |
| 6 | Validar todo lo que llega | ✅ | 3 capas: formularios (`utils/validar.js`), solo se envían campos permitidos (`supabase/tablas.js`), y la base de datos revisa otra vez (largos, precios ≥ 0, WhatsApp `593` + 9 números, enlaces `https://`, mapa solo de Google, colores y tamaños de una lista). Fotos: solo JPG/PNG/WEBP de máx. 5 MB (en la web **y** en Supabase). |
| 7 | Nada sin escapar (XSS) | ✅ | React muestra todo como texto. **No hay** `innerHTML` ni `dangerouslySetInnerHTML` ni `eval`. Los enlaces (redes, mapa) se revisan con `utils/seguridad.js`. La CSP no permite scripts de otros sitios. |
| 8 | CORS solo al dominio | ⚠️ | La web no tiene servidor propio: habla directo con Supabase, y su API pública acepta cualquier origen (no se puede cerrar en el plan gratis). **No es un riesgo** porque lo que protege es RLS: desde otro sitio solo se puede leer lo que ya es público. 👉 Pon tu dominio en Supabase → Authentication → URL Configuration (Site URL y Redirect URLs). |
| 9 | Cabeceras de seguridad | ✅ | `netlify.toml`: CSP estricta (solo tu web + Supabase + mapa de Google), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP. El panel lleva `no-store` y `noindex`. Las letras y Bootstrap ahora van dentro de la web (ya no dependen de CDNs). |
| 10 | Sesiones: cookie segura | ⚠️ | Una web React sin servidor no puede usar cookies `HttpOnly`. Lo compensamos así: la sesión se guarda en **sessionStorage** (se borra al cerrar el navegador), el token dura **1 hora** y se renueva solo, la CSP impide meter scripts, y en el panel no se cargan cosas de otros sitios. |
| 11 | Error sin detalles internos | ✅ | `utils/errores.js` convierte cada error en un mensaje simple. El detalle solo sale en la consola **en tu PC** (`npm run dev`), nunca en la web publicada. El login no dice si el correo existe. No se publican los source maps. |
| 12 | `.gitignore` y `.env` | ✅ | `.gitignore` excluye `.env`, `.env.*`, `node_modules/`, `dist/`, `.ai` y `.zip`. Hay un `.env.example` sin claves reales. |

**Extras revisados:** `npm audit` = 0 vulnerabilidades. Al subir una foto se borran los datos ocultos (GPS del celular). `robots.txt` pide a Google no indexar `/admin`.

## 👉 Lo que falta hacer a mano en Supabase (una sola vez)
1. Authentication → Sign In / Providers → **apagar "Allow new users to sign up"**.
2. Authentication → URL Configuration → **Site URL** = tu dominio (ej. `https://yausig-churikuna.netlify.app`).
3. Authentication → Sign In / Providers → Email → **Minimum password length = 12**.
4. Mary: contraseña larga y única, que no use en otro sitio.
