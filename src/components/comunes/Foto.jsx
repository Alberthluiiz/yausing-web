// =========================================================
// Foto.jsx · Muestra una foto del depósito de Supabase.
//
// miniatura={true}: usa la versión chica (más rápida). Si la
// miniatura aún no existe, prueba con la foto grande.
// Si la foto no existe o falla, muestra el icono de Yausig.
// =========================================================
import { useState } from "react";
import { urlFoto, urlMiniatura } from "../../supabase/fotos";
import icono from "../../assets/img/yausig-icono.svg";

export default function Foto({ ruta, alt = "", className = "", perezosa = true, miniatura = false }) {
  // Lista de direcciones a probar, en orden: miniatura → grande → icono
  const opciones = [miniatura && urlMiniatura(ruta), urlFoto(ruta)].filter(Boolean);
  const [estado, setEstado] = useState({ ruta, intento: 0 });
  // Si cambia la foto (ej: en el panel), se vuelve a empezar
  const intento = estado.ruta === ruta ? estado.intento : 0;
  const src = opciones[intento] ?? icono;

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      className={className}
      loading={perezosa ? "lazy" : "eager"}
      decoding="async"
      onError={() => setEstado({ ruta, intento: intento + 1 })}
    />
  );
}
