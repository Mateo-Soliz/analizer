"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DesktopNav from "./nav/desktop-nav";
import MobileMenu from "./nav/mobile-menu";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Analizar Datos", href: "/analyze" },
  { label: "Iniciar Sesión", href: "/login" },
  { label: "Registrarse", href: "/register" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Ocultar solo el botón correspondiente a la ruta actual
  const filteredNavItems = navItems.filter(
    (item) => {
      if (pathname === "/login" && item.href === "/login") {
        return false;
      }
      if (pathname === "/register" && item.href === "/register") {
        return false;
      }
      return true;
    }
  );


  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-[#2563EB] font-bold text-xl">
              BioAnalyzer
            </Link>
          </div>

          <DesktopNav navItems={filteredNavItems} />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1E293B] hover:text-[#2563EB] focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          navItems={filteredNavItems}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
}
