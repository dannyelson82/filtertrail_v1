import Link from "next/link";
import { Navbar } from "../../components/Navbar";

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
    acc[part.category] = (acc[part.category] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = Object.entries(partsByCategory).map(([category, count]) => ({
    category,
    count,
  }));

  const totalInventoryValue = parts.reduce((sum, part) => {
    const value = Number(part.current_value) || 0;
    const qty = Number(part.quantity_on_hand) || 0;
    return sum + value * qty;
  }, 0);

  return (
    <div>
      <Navbar />

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

          <Link href="/parts/create" style={{ textDecoration: "none" }}>
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
            <h2 style={{ color: "#101828", margin: 0 }}>Parts by Category</h2>

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
                  <div style={{ color: "#667085", fontSize: "0.8rem" }}>{category}</div>
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
            <div style={{ overflowX: "auto", marginTop: "0.8rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                <thead>
                  <tr>
                    {["Name", "Category", "Part Number", "Brand", "Quantity", "Location", "Condition", "Value"].map((heading) => (
                      <th key={heading} style={headerCellStyle}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {parts.map((part) => (
                    <tr key={part.id}>
                      <td style={cellStyle}>
                        <Link
                          href={`/parts/${part.id}`}
                          style={{
                            color: "#175cd3",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {part.name}
                        </Link>
                      </td>
                      <td style={cellStyle}>{part.category}</td>
                      <td style={cellStyle}>{part.part_number || "—"}</td>
                      <td style={cellStyle}>{part.brand || "—"}</td>
                      <td style={cellStyle}>
                        {part.quantity_on_hand ?? "—"}
                      </td>
                      <td style={cellStyle}>{part.location || "—"}</td>
                      <td style={cellStyle}>{part.condition_status || "—"}</td>
                      <td style={cellStyle}>
                        {part.current_value != null
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(part.current_value)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
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

const headerCellStyle = {
  textAlign: "left",
  padding: "0.7rem",
  borderBottom: "2px solid #d0d5dd",
  color: "#475467",
  fontSize: "0.85rem",
};

const cellStyle = {
  padding: "0.7rem",
  borderBottom: "1px solid #eaecf0",
  color: "#344054",
  verticalAlign: "top",
  fontSize: "0.9rem",
};
