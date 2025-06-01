import Link from "next/link";

interface FooterItemProps {
  href: string;
  label: string;
}

export default function FooterItem({ href, label }: FooterItemProps) {
  return (
    <li>
      <Link href={href} className="text-base text-gray-500 hover:text-gray-900">
        {label}
      </Link>
    </li>
  );
} 