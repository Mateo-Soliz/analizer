"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DesktopNav from "./nav/desktop-nav";
import MobileMenu from "./nav/mobile-menu";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Analizar Datos", href: "/analizar" },
  { label: "Iniciar Sesión", href: "/login" },
  { label: "Registrarse", href: "/register" },
];

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (isLoggedIn) {
    return null;
  }
  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-[#2563EB] font-bold text-xl">
              BioAnalyzer
            </Link>
          </div>

          <DesktopNav navItems={navItems} />

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
          navItems={navItems}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
}
