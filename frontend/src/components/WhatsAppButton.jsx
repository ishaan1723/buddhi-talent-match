import { FaWhatsapp } from "react-icons/fa";
import { useSettings } from "../utils/SettingsContext";

function WhatsAppButton() {
  const { whatsapp } = useSettings();

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20the%20Career%20Clarity%20Assessment.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
    >
      <FaWhatsapp size={30} />
    </a>
  );
}

export default WhatsAppButton;