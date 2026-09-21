import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { EntityCard } from "../../components/EntityCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json();
}

function getQuantity(part) {
  return Number(part.quantity ?? part.quantity_on_hand ?? 0);
}

function getCostPerUnit(part) {
  const cost = part.cost_per_unit ?? part.current_value;

  if (cost === null || cost === undefined || cost === "") {
    return null;
  }

  const value = Number(cost);
  return Number.isFinite(value) ? value : null;
}

function getInventoryValue(part) {
  const quantity = getQuantity(part);
  const costPerUnit = getCostPerUnit(part);

  return costPerUnit === null ? null : quantity * costPerUnit;
}

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function PartsPage() {
  const [parts, tools, vehicles, loans] = await Promise.all([
    fetchJson("/api/parts/"),
    fetchJson("/api/tools/"),
    fetchJson("/api/vehicles/"),
    fetchJson("/api/loans/"),
  ]);

  const totalParts = parts.length;
  const totalTools = tools.length;
  const totalVehicles = vehicles.length;

  const partsByCategory = parts.reduce((acc, part) => {
    const category = part.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = Object.entries(partsByCategory).map(
    ([category, count]) => ({
      category,
      count,
    })
  );

  const totalInventoryValue = parts.reduce((sum, part) => {
    return sum + (getInventoryValue(part) ?? 0);
  }, 0);

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-content">
        <main
          style={{
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1 style={{ color: "#101828", margin: 0 }}>Parts Dashboard</h1>

              <p style={{ color: "#667085", marginTop: "0.45rem" }}>
                Overview of parts inventory, categories, and value.
              </p>
            </div>

            <Link href="/parts/new" style={{ textDecoration: "none" }}>
              <button type="button" style={createButtonStyle}>
                Add Part
              </button>
            </Link>
          </div>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <StatCard label="Total Parts" value={totalParts} />
            <StatCard label="Total Tools" value={totalTools} />
            <StatCard label="Total Vehicles" value={totalVehicles} />
            <StatCard
              label="Total Inventory Value"
              value={new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(totalInventoryValue)}
            />
          </section>

          {categoryLabels.length > 0 ? (
            <section style={{ marginTop: "1.5rem" }}>
              <h2 style={{ color: "#101828", margin: 0 }}>
                Parts by Category
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.8rem",
                  marginTop: "0.8rem",
                }}
              >
                {categoryLabels.map(({ category, count }) => (
                  <div
                    key={category}
                    style={{
                      padding: "0.8rem",
                      border: "1px solid #eaecf0",
                      borderRadius: 7,
                      background: "#fcfcfd",
                    }}
                  >
                    <div style={{ color: "#667085", fontSize: "0.8rem" }}>
                      {category}
                    </div>

                    <div
                      style={{
                        marginTop: "0.25rem",
                        color: "#101828",
                        fontWeight: 700,
                      }}
                    >
                      {count} {count === 1 ? "part" : "parts"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={{ color: "#101828", margin: 0 }}>All Parts</h2>

            {parts.length === 0 ? (
              <p style={{ color: "#667085", marginTop: "0.8rem" }}>
                No parts have been added yet.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1rem",
                  marginTop: "0.8rem",
                }}
              >
                {parts.map((part) => {
                  const quantity = getQuantity(part);
                  const costPerUnit = getCostPerUnit(part);
                  const inventoryValue = getInventoryValue(part);

                  const details = [
                    ["Category", part.category || "—"],
                    ["Part Number", part.part_number || "—"],
                    ["Quantity", quantity],
                    ["Cost / Unit", formatCurrency(costPerUnit)],
                    ["Inventory Value", formatCurrency(inventoryValue)],
                    ["Location", part.location || "—"],
                    ["Supplier", part.supplier || "—"],
                  ];

                  return (
                    <EntityCard
                      key={part.id}
                      href={`/parts/${part.id}`}
                      title={part.name}
                      subtitle={part.category || "Uncategorized"}
                      details={details}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #d0d5dd",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <div style={{ color: "#667085", fontSize: "0.85rem" }}>{label}</div>

      <div
        style={{
          marginTop: "0.4rem",
          color: "#101828",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const createButtonStyle = {
  padding: "0.55rem 0.9rem",
  cursor: "pointer",
  border: "1px solid #175cd3",
  borderRadius: 6,
  background: "#175cd3",
  color: "#fff",
  fontWeight: 700,
};
