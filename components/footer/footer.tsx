import { format } from "date-fns";
import { es } from "date-fns/locale";
import FooterSection from "./footer-section";

export default function Footer() {
  const currentYear = format(new Date(), "yyyy", { locale: es });

  const footerSections = [
    {
      title: "Enlaces",
      items: [
        { label: "Sobre nosotros", href: "/about" },
        { label: "Contacto", href: "/contact" },
        { label: "Privacidad", href: "/privacy" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Términos de uso", href: "/terms" },
        { label: "Política de cookies", href: "/cookies" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Análisis Circadianos
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Herramienta especializada para el análisis de datos biomédicos circadianos
            </p>
          </div>
          {footerSections.map((section) => (
            <FooterSection
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {currentYear} Análisis Circadianos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 