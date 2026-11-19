// =========================================================
// sitemap.js · Netlify Edge Function → /sitemap.xml
//
// ¿Para qué? Es la "lista de páginas" que leen Google y Bing.
// Se arma sola con la portada + un enlace por cada producto
// publicado (/producto/<id>), así Google puede mostrar cada
// prenda en sus resultados.
//
// SEGURIDAD: usa solo la clave PÚBLICA y solo lee productos
// publicados (además lo controla RLS en Supabase).
// Si Supabase falla, entrega al menos la portada.
// =========================================================

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function productosPublicados() {
  const base = Netlify.env.get("VITE_SUPABASE_URL");
  const clave = Netlify.env.get("VITE_SUPABASE_ANON_KEY");
  if (!base || !clave) return [];
  const respuesta = await fetch(`${base}/rest/v1/productos?publicado=eq.true&select=id,actualizado_en&order=orden`, {
    headers: { apikey: clave, Authorization: `Bearer ${clave}` },
    signal: AbortSignal.timeout(2500),
  });
  if (!respuesta.ok) return [];
  return (await respuesta.json()).filter((producto) => UUID.test(producto.id));
}

// Arma el XML. paginas = [{ direccion, fecha? }]
export function armarSitemap(paginas) {
  const filas = paginas.map(
    ({ direccion, fecha }) =>
      `  <url><loc>${direccion}</loc>${fecha ? `<lastmod>${fecha.slice(0, 10)}</lastmod>` : ""}</url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join("\n")}\n</urlset>\n`;
}

export default async function sitemap(request) {
  const sitio = new URL(request.url).origin;
  const productos = await productosPublicados().catch(() => []);
  const paginas = [
    { direccion: `${sitio}/` },
    ...productos.map((producto) => ({ direccion: `${sitio}/producto/${producto.id}`, fecha: producto.actualizado_en })),
  ];
  return new Response(armarSitemap(paginas), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600", // se vuelve a armar cada hora
    },
  });
}

export const config = {
  path: "/sitemap.xml",
};
