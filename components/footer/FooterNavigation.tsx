const sectionLinks = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function FooterNavigation() {
  return (
    <nav
      className="flex flex-wrap gap-x-6 gap-y-2 sm:tracking-[0.28em] tracking-[0.16em] tracking-[0.28em]"
      aria-label="Footer navigation"
    >
      {sectionLinks.map(({ label, href }) => (
        <a
          key={href}
          className="scramble-text hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          href={href}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
