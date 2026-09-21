import Link from "next/link";
import { Navbar } from "../../components/Navbar";

const API_BASE =
  process.env.API_BASE_URL || "http://192.168.50.37:8001";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json();
}

export default async function DashboardPage() {
  const [vehicles, tools, parts, loans] = await Promise.all([
    fetchJson("/api/vehicles/"),
    fetchJson("/api/tools/"),
    fetchJson("/api/parts/"),
    fetchJson("/api/loans/"),
  ]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
        <main className="page-content">
          <h1 style={{ color: "#0B1F33" }}>Dashboard</h1>

          <p style={{ color: "#607486" }}>
            Overview of your equipment and inventory.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <DashboardCard
              title="Vehicles"
              value={vehicles.length}
              href="/vehicles"
              color="#248BDB"
            />

            <DashboardCard
              title="Tools"
              value={tools.length}
              href="/tools"
              color="#F28C28"
            />

            <DashboardCard
              title="Parts"
              value={parts.length}
              href="/parts"
              color="#35A66F"
            />

            <DashboardCard
              title="Loans"
              value={loans.length}
              href="/loans"
              color="#0B1F33"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, href, color }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          padding: "1.25rem",
          borderTop: `4px solid ${color}`,
        }}
      >
        <div
          style={{
            color: "#607486",
            fontWeight: 700,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: "0.5rem",
            color: "#0B1F33",
            fontSize: "2rem",
            fontWeight: 800,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: "0.5rem",
            color,
            fontWeight: 700,
          }}
        >
          View {title.toLowerCase()} →
        </div>
      </div>
    </Link>
  );
}
