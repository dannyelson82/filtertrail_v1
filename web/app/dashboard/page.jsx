import { Navbar } from "../../components/Navbar";
import Link from "next/link";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

async function getCounts() {
  const base = API_BASE;

  async function safeCount(path) {
    try {
      const res = await fetch(`${base}${path}`, { cache: "no-store" });
      if (!res.ok) return 0;
      const data = await res.json();
      return Array.isArray(data) ? data.length : 0;
    } catch {
      return 0;
    }
  }

  const [vehicles, tools, parts, loans] = await Promise.all([
    safeCount("/api/vehicles/"),
    safeCount("/api/tools/"),
    safeCount("/api/parts/"),
    safeCount("/api/loans/"),
  ]);

  return { vehicles, tools, parts, loans };
}

export default async function DashboardPage() {
  const { vehicles, tools, parts, loans } = await getCounts();

  return (
    <div>
      <Navbar />
      <main style={{ padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Dashboard</h1>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>Quick stats</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <StatCard title="Vehicles" value={vehicles} href="/vehicles" />
            <StatCard title="Tools" value={tools} href="/tools" />
            <StatCard title="Parts" value={parts} href="/parts" />
            <StatCard title="Loans" value={loans} href="/loans" />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, href }) {
  return (
    <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 6,
          padding: "1rem",
          background: "#fff",
        }}
      >
        <div style={{ color: "#666", fontSize: "0.9rem" }}>{title}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.25rem" }}>{value}</div>
      </div>
    </a>
  );
}
