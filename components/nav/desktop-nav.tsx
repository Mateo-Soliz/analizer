import NavItem from "./nav-item";

interface DesktopNavProps {
  navItems: Array<{ label: string; href: string }>;
}

export default function DesktopNav({ navItems }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex space-x-6">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          isRegister={item.href === "/register"}
        />
      ))}
    </nav>
  );
} 