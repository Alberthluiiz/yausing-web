// WhatsappFlotante.jsx · Botón verde que siempre está abajo a la derecha
export default function WhatsappFlotante({ enlace }) {
  return (
    <a href={enlace} target="_blank" rel="noopener noreferrer" className="whatsapp-flotante" aria-label="Escríbenos por WhatsApp">
      <i className="bi bi-whatsapp" />
    </a>
  );
}
