import FooterItem from "./footer-item";

interface FooterSectionProps {
  title: string;
  items: Array<{ label: string; href: string }>;
}

export default function FooterSection({ title, items }: FooterSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <FooterItem key={item.href} href={item.href} label={item.label} />
        ))}
      </ul>
    </div>
  );
} 