import { MessageCircleMore } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const whatsappNumber = "255700000000";

const FloatingWhatsApp = () => {
  const { copy } = useLanguage();
  const whatsappText = encodeURIComponent(copy.whatsapp.text);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
      target="_blank"
      rel="noreferrer"
      aria-label={copy.whatsapp.label}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full border border-white/20 bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_55px_-24px_rgba(37,211,102,0.8)] transition-transform hover:-translate-y-1"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18">
        <MessageCircleMore size={20} />
      </span>
      <span className="hidden sm:inline">{copy.whatsapp.cta}</span>
    </a>
  );
};

export default FloatingWhatsApp;
