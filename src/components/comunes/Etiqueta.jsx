// Etiqueta.jsx · Texto pequeño con un rombito de colores encima de cada título
export default function Etiqueta({ children }) {
  return (
    <p className="etiqueta">
      <i className="rombo" />
      {children}
    </p>
  );
}
