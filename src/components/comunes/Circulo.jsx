// =========================================================
// Circulo.jsx · Un circulito de color
// Si el color no tiene código (ej: "etc."), muestra el texto.
// =========================================================
import { esClaro, leerColor } from "../../utils/colores";

export default function Circulo({ valor, tamano = 22 }) {
  const { nombre, hex } = leerColor(valor);
  if (!hex) return <span className="circulo-texto">{nombre}</span>;
  return (
    <span
      className={`circulo ${esClaro(hex) ? "claro" : ""}`}
      style={{ "--color": hex, "--tamano": `${tamano}px` }}
      title={nombre}
      aria-label={nombre}
      role="img"
    />
  );
}
