import Link from "next/link";

const Footer = () => {
  const links = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Documents", href: "/documents" },
    { title: "Funds", href: "/panchayat_funds" },
  ];
  return (
    <footer className="w-full border-t border-line py-8 mt-8">
      <ul className="flex flex-row flex-wrap justify-center gap-6">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-center text-xs text-muted mt-6">
        © {new Date().getFullYear()} MeriPanchayat — Digital Gram Panchayat
      </p>
    </footer>
  );
};
export default Footer;
