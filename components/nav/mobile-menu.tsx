import NavItem from "./nav-item";

interface MobileMenuProps {
  isOpen: boolean;
  navItems: Array<{ label: string; href: string }>;
  onItemClick: () => void;
}

export default function MobileMenu({ isOpen, navItems, onItemClick }: MobileMenuProps) {
  return (
    <div 
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="py-2 pb-4">
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              isMobile={true}
              onClick={onItemClick}
              isRegister={item.href === "/register"}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 