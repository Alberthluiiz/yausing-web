// =========================================================
// vista-previa.js · Netlify Edge Function
//
// ¿Para qué? Cuando alguien comparte un enlace de la tienda por
// WhatsApp o Facebook, esas apps leen las etiquetas "og:" del HTML
// para mostrar la tarjetita con foto, título y texto.
//
// Como la web es React, el HTML siempre es el mismo. Esta función
// corre en Netlify ANTES de entregar la página y:
//   - En la portada: pone la dirección completa de la imagen
//     (WhatsApp necesita "https://...", no "/vista-previa.jpg").
//   - En /producto/<id>: busca ese producto en Supabase y pone
//     su foto, su nombre y su precio.
//
// SEGURIDAD:
//   - Usa solo la clave PÚBLICA (la misma de la web) y solo lee
//     productos publicados (además lo controla RLS en Supabase).
//   - El id se revisa (debe ser un UUID) antes de buscar.
//   - Todo texto se "escapa" antes de meterlo en el HTML (evita XSS).
//   - Si algo falla, se entrega la página normal, sin romper nada.
//
// Variables (las mismas de la web, en Netlify → Site configuration
// → Environment variables): VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
// =========================================================

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Convierte < > " ' & en texto seguro para HTML
export function escapar(texto) {
  const seguro = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(texto ?? "").replace(/[&<>"']/g, (letra) => seguro[letra]);
}

// 25 → "$25.00"
const precioTexto = (valor) => `$${Number(valor).toFixed(2)}`;

// Precio más bajo del producto (las tallas pueden tener precio propio: "XL:20")
export function precioDesde(producto) {
  const tallas = producto.tallas ?? [];
  const precios = tallas
    .map((talla) => String(talla).split(":")[1])
    .filter((precio) => precio !== undefined && precio !== "")
    .map(Number)
    .filter(Number.isFinite);
  const todasConPrecio = precios.length > 0 && precios.length === tallas.length;
  const lista = todasConPrecio ? precios : [Number(producto.precio), ...precios];
  return { valor: Math.min(...lista), varia: new Set(lista).size > 1 };
}

// Cambia el "content" de <meta property="..."> o <meta name="...">
function cambiarMeta(html, atributo, nombre, valor) {
  const patron = new RegExp(`(<meta ${atributo}="${nombre}" content=")[^"]*(")`);
  return html.replace(patron, (_, inicio, fin) => `${inicio}${escapar(valor)}${fin}`);
}

// Pone las etiquetas. datos = { titulo?, descripcion?, imagen, url, cuadrada? }
export function ponerEtiquetas(html, datos) {
  let nuevo = html;
  if (datos.titulo) {
    nuevo = cambiarMeta(nuevo, "property", "og:title", datos.titulo);
    nuevo = nuevo.replace(/<title>[^<]*<\/title>/, () => `<title>${escapar(datos.titulo)}</title>`);
  }
  if (datos.descripcion) {
    nuevo = cambiarMeta(nuevo, "property", "og:description", datos.descripcion);
  }
  if (datos.cuadrada) {
    // La foto del producto no mide 1200x630: se quitan esas medidas
    nuevo = nuevo.replace(/\s*<meta property="og:image:(width|height)" content="\d+" \/>/g, "");
  }
  nuevo = cambiarMeta(nuevo, "property", "og:image", datos.imagen);
  nuevo = cambiarMeta(nuevo, "property", "og:url", datos.url);
  return nuevo;
}

// Busca un producto publicado en Supabase (o null si no existe)
async function buscarProducto(id) {
  const base = Netlify.env.get("VITE_SUPABASE_URL");
  const clave = Netlify.env.get("VITE_SUPABASE_ANON_KEY");
  if (!base || !clave || !UUID.test(id)) return null;

  const campos = "nombre,descripcion,precio,tallas,foto_ruta,agotado";
  const url = `${base}/rest/v1/productos?id=eq.${id}&publicado=eq.true&select=${campos}`;
  const respuesta = await fetch(url, {
    headers: { apikey: clave, Authorization: `Bearer ${clave}` },
    signal: AbortSignal.timeout(2500), // si Supabase tarda, no se hace esperar al cliente
  });
  if (!respuesta.ok) return null;
  const [producto] = await respuesta.json();
  if (!producto) return null;
  const foto = producto.foto_ruta ? `${base}/storage/v1/object/public/fotos/${producto.foto_ruta}` : null;
  return { ...producto, foto };
}

// Arma los datos de la vista previa de un producto
export function datosDeProducto(producto, datosBase) {
  const { valor, varia } = precioDesde(producto);
  const precio = `${varia ? "Desde " : ""}${precioTexto(valor)}`;
  const descripcion = producto.agotado
    ? "Agotado por ahora. Escríbenos y te avisamos cuando vuelva a llegar."
    : `${producto.descripcion ? `${producto.descripcion} ` : ""}Elige tu talla y color y pídelo por WhatsApp.`;
  return {
    ...datosBase,
    titulo: `${producto.nombre} · ${precio} · Yausig Churikuna`,
    descripcion,
    imagen: producto.foto ?? datosBase.imagen,
    cuadrada: Boolean(producto.foto),
  };
}

export default async function vistaPrevia(request, context) {
  const respuesta = await context.next();
  const tipo = respuesta.headers.get("content-type") ?? "";
  if (!tipo.includes("text/html")) return respuesta;

  const cabeceras = new Headers(respuesta.headers);
  cabeceras.delete("content-length"); // el tamaño cambia
  const html = await respuesta.text();

  try {
    const direccion = new URL(request.url);
    const sitio = direccion.origin;
    let datos = { imagen: `${sitio}/vista-previa.jpg`, url: `${sitio}${direccion.pathname}` };

    const id = direccion.pathname.match(/^\/producto\/([^/]+)\/?$/)?.[1];
    if (id) {
      const producto = await buscarProducto(id).catch(() => null);
      if (producto) datos = datosDeProducto(producto, datos);
    }

    return new Response(ponerEtiquetas(html, datos), { status: respuesta.status, headers: cabeceras });
  } catch {
    return new Response(html, { status: respuesta.status, headers: cabeceras }); // la página normal
  }
}

// En qué direcciones corre (no en /admin ni en los archivos)
export const config = {
  path: ["/", "/producto/*"],
};
