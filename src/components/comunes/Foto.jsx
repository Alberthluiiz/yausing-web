// =========================================================
// Foto.jsx · Muestra una foto del depósito de Supabase.
// Si la foto no existe o falla, muestra el icono de Yausig.
// =========================================================
import { useState } from "react";
import { urlFoto } from "../../supabase/fotos";
import icono from "../../assets/img/yausig-icono.svg";

export default function Foto({ ruta, alt = "", className = "", perezosa = true }) {
  const [fallo, setFallo] = useState(false);
  const src = !fallo && urlFoto(ruta) ? urlFoto(ruta) : icono;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={perezosa ? "lazy" : "eager"}
      decoding="async"
      onError={() => setFallo(true)}
    />
  );
}
