import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Filter Trail</h1>
      <p>Welcome to your self-hosted maintenance and inventory tracker.</p>
      <ul style={{ marginTop: "1rem" }}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/backups">Backups</Link></li>
      </ul>
    </main>
  );
}
