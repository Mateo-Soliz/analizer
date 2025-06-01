import Link from "next/link";

interface NavItemProps {
  href: string;
  label: string;
  isMobile?: boolean;
  onClick?: () => void;
  isRegister?: boolean;
}

export default function NavItem({ 
  href, 
  label, 
  isMobile = false, 
  onClick,
  isRegister = false 
}: NavItemProps) {
  const baseClasses = "text-sm font-medium px-3 py-2";
  const mobileClasses = isMobile 
    ? "text-[#1E293B] hover:text-[#2563EB]"
    : "text-[#1E293B] rounded-md hover:text-[#2563EB] hover:bg-gray-100";
  const registerClasses = isRegister 
    ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] rounded-md transition-colors"
    : mobileClasses;

  return (
    <Link
      href={href}
      className={`${baseClasses} ${registerClasses}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
} 