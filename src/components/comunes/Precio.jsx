// Precio.jsx · Precio bonito:  $ (pequeño) 35 (grande) .00 (pequeño)
import { partesPrecio } from "../../utils/formato";

export default function Precio({ valor }) {
  const { enteros, centavos } = partesPrecio(valor);
  return (
    <span className="precio-valor">
      <sup>$</sup>
      <strong>{enteros}</strong>
      <span>.{centavos}</span>
    </span>
  );
}
