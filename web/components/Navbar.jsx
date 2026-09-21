import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/tools", label: "Tools" },
  { href: "/parts", label: "Parts" },
  { href: "/loans", label: "Loans" },
  { href: "/borrowers", label: "Borrowers" },
  { href: "/backups", label: "Backups" },
];

export function Navbar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <Link href="/dashboard" className="sidebar-brand">
        <span className="sidebar-brand-name">Filter Trail</span>
        <span className="sidebar-brand-subtitle">
          Equipment and inventory tracker
        </span>
      </Link>

      <div className="sidebar-section-label">Workspace</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} className="sidebar-link">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">Local development</div>
    </aside>
  );
}
