import Link from "next/link";

export function Navbar() {
  const navStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.75rem 1.25rem",
    borderBottom: "1px solid #ddd",
    background: "#fafafa",
    fontFamily: "system-ui, sans-serif",
    flexWrap: "wrap",
  };

  const linkStyle = {
    color: "#555",
    textDecoration: "none",
    fontSize: "0.95rem",
  };

  return (
    <nav style={navStyle}>
      <Link
        href="/dashboard"
        style={{
          ...linkStyle,
          color: "#111",
          fontWeight: 700,
          marginRight: "0.25rem",
        }}
      >
        Filter Trail
      </Link>

      <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
      <Link href="/vehicles" style={linkStyle}>Vehicles</Link>
      <Link href="/tools" style={linkStyle}>Tools</Link>
      <Link href="/parts" style={linkStyle}>Parts</Link>
      <Link href="/loans" style={linkStyle}>Loans</Link>
      <Link href="/borrowers" style={linkStyle}>Borrowers</Link>
      <Link href="/backups" style={linkStyle}>Backups</Link>
    </nav>
  );
}
