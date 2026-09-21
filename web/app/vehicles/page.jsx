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

export default async function VehiclesPage() {
  const [vehicles, tools, parts, loans] = await Promise.all([
    fetchJson("/api/vehicles/"),
    fetchJson("/api/tools/"),
    fetchJson("/api/parts/"),
    fetchJson("/api/loans/"),
  ]);

  const totalVehicles = vehicles.length;
  const totalTools = tools.length;
  const totalParts = parts.length;

  const totalVehicleValue = vehicles.reduce((sum, v) => {
    return sum + (Number(v.current_value) || 0);
  }, 0);

  const vehiclesByType = vehicles.reduce((acc, v) => {
    const type = v.vehicle_type || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const typeLabels = Object.entries(vehiclesByType).map(([type, count]) => ({
    type,
    count,
  }));

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
            <h1 style={{ color: "#101828", margin: 0 }}>Vehicles Dashboard</h1>

            <p style={{ color: "#667085", marginTop: "0.45rem" }}>
              Overview of vehicles, types, and fleet value.
            </p>
          </div>

          <Link href="/vehicles/create" style={{ textDecoration: "none" }}>
            <button type="button" style={createButtonStyle}>
              Add Vehicle
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
          <StatCard label="Total Vehicles" value={totalVehicles} />
          <StatCard label="Total Tools" value={totalTools} />
          <StatCard label="Total Parts" value={totalParts} />
          <StatCard
            label="Total Vehicle Value"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(totalVehicleValue)}
          />
        </section>

        {typeLabels.length > 0 ? (
          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={{ color: "#101828", margin: 0 }}>Vehicles by Type</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.8rem",
                marginTop: "0.8rem",
              }}
            >
              {typeLabels.map(({ type, count }) => (
                <div
                  key={type}
                  style={{
                    padding: "0.8rem",
                    border: "1px solid #eaecf0",
                    borderRadius: 7,
                    background: "#fcfcfd",
                  }}
                >
                  <div style={{ color: "#667085", fontSize: "0.8rem" }}>{type}</div>
                  <div
                    style={{
                      marginTop: "0.25rem",
                      color: "#101828",
                      fontWeight: 700,
                    }}
                  >
                    {count} {count === 1 ? "vehicle" : "vehicles"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section style={{ marginTop: "1.5rem" }}>
          <h2 style={{ color: "#101828", margin: 0 }}>All Vehicles</h2>

          {vehicles.length === 0 ? (
            <p style={{ color: "#667085", marginTop: "0.8rem" }}>
              No vehicles have been added yet.
            </p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: "0.8rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                <thead>
                  <tr>
                    {["Name", "Type", "Make", "Model", "Year", "VIN", "Value", "Status"].map((heading) => (
                      <th key={heading} style={headerCellStyle}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td style={cellStyle}>
                        <Link
                          href={`/vehicles/${v.id}`}
                          style={{
                            color: "#175cd3",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {v.name}
                        </Link>
                      </td>
                      <td style={cellStyle}>{v.vehicle_type || "—"}</td>
                      <td style={cellStyle}>{v.make || "—"}</td>
                      <td style={cellStyle}>{v.model || "—"}</td>
                      <td style={cellStyle}>{v.year ?? "—"}</td>
                      <td style={cellStyle}>{v.vin || "—"}</td>
                      <td style={cellStyle}>
                        {v.current_value != null
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(v.current_value)
                          : "—"}
                      </td>
                      <td style={cellStyle}>{v.condition_status || "—"}</td>
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
