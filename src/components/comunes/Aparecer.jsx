// Aparecer.jsx · Envuelve algo para que aparezca suave al bajar (ver hooks/useAparecer.js)
import { useAparecer } from "../../hooks/useAparecer";

export default function Aparecer({ children, className = "", como: Etiqueta = "div" }) {
  const ref = useAparecer();
  return (
    <Etiqueta ref={ref} className={`aparecer ${className}`}>
      {children}
    </Etiqueta>
  );
}
